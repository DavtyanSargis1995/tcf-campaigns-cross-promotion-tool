import axios from 'axios';
import firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/database';

const setQueryParamas = (size, platform, matchParam, filter) => {
  const queryParams = {
    query: {
      bool: {
        must: [
          {
            match: {
              platform: platform
            }
          }
        ]
      }
    }
  };

  if (size) {
    queryParams.size = size;
  }

  if (matchParam) {
    queryParams.query.bool.must.push(matchParam);
  }

  if (filter) {
    queryParams.query.bool.filter = filter;
  }

  return queryParams;
};

const CROSSPROM_URL = 'https://search.crossprom.com/campaigns/_search';
const CROSSPROM_HEADERS = {
  'content-type': 'application/json;charset=UTF-8'
};

const initialCampaign = {
  hitId: null,
  id: null,
  state: '',
  backers: '',
  title: '',
  description: '',
  url: '',
  imageUrl: ''
};

export default {
  namespaced: true,
  state: {
    campaign: Object.assign(initialCampaign),
    campaignsTitlesList: [],
    campaigns: [],
    titlesToNotLoad: []
  },
  mutations: {

    /* Setting current Campaign (used to load data in modal dialog when adding or editing data) */
    setCampaign (state, payload) {
      state.campaign = { ...state.campaign, ...payload };
    },

    /* This is to have a list of already used titles for not listing them in search dropdown once again */
    addTitleForUniqueness (state, payload) {
      state.titlesToNotLoad = [...state.titlesToNotLoad, payload];
    },

    /*
    * This is for
    * 1. adding the newely created campaign to the list
    * 2. updating list view after editing a campaign
    *
    */
    updateCampaign (state, payload) {
      const campaignIndex = state.campaigns.findIndex(item => item.id === payload.id);
      if (campaignIndex !== -1) {
        state.campaigns = state.campaigns.map(el => {
          return el.id === payload.id ? payload : el;
        });
      } else {
        state.campaigns = [payload, ...state.campaigns];
      }
    },

    /* This is to reset campaign data to show empty fields in modal dialog every time we switch through the campaigns */
    resetCampaign (state, payload) {
      state.campaign = Object.assign(initialCampaign);
    },

    /* Delete campaign */
    deleteCampaign (state, payload) {
      state.campaigns = state.campaigns.filter(item => item.id !== payload.id);
    },

    /* Setting loaded campaigns */
    setCampaigns (state, payload) {
      state.campaigns = payload;
    },

    /* Setting loaded campaigns' titles */
    setCampaignTitles (state, payload) {
      state.campaignsTitlesList = payload;
    }
  },
  actions: {

    /* Action for deleting campaign data from firebase database */
    async deleteCampaign ({ commit }, payload) {
      commit('setLoading', true, { root: true });
      commit('clearError', null, { root: true });
      await firebase.database().ref('campaigns/').child(payload.id).remove();

      // if it has an image, delete it toolbar
      if (payload.filename) {
        try {
          firebase.storage().ref().child(payload.filename).delete();
        } catch (error) {
          commit('setError', error.message, { root: true });
        }
      }
      commit('deleteCampaign', { id: payload.id });
      commit('setLoading', false, { root: true });
    },

    /* Action for saving (updating) campaign data to firebase database */
    async saveCampaign ({ commit, state, rootState }) {
      let key = '';
      let data;
      commit('setLoading', true, { root: true });
      commit('clearError', null, { root: true });
      const payload = {
        hitId: state.campaign.hitId,
        title: state.campaign.title,
        description: state.campaign.description,
        url: state.campaign.url,
        authorName: rootState.user.user.name,
        authorId: rootState.user.user.id,
        imageUrl: state.campaign.imageUrl || ''
      };
      try {
        if (state.campaign.id) {
          // if we already have this campaign in the database, update its info
          await firebase.database().ref('campaigns').child(state.campaign.id).update(payload);
        } else {
          // if it's a new one, add it to the database
          data = await firebase.database().ref('/campaigns').push(payload);
          commit('addTitleForUniqueness', state.campaign.title);
        }
        key = data ? data.key : state.campaign.id;

        if (!state.campaign.image) {
          commit('setLoading', false, { root: true });
          commit('modal/toggleModal', null, { root: true });
          commit('updateCampaign', { ...payload, id: key });
          return;
        }

        // if we have an image to upload
        const filename = state.campaign.image.name;
        const ext = filename.slice(filename.lastIndexOf('.'));
        const fileData = await firebase.storage().ref('campaigns/' + key + ext).put(state.campaign.image);
        const downloadURL = await fileData.ref.getDownloadURL();
        await firebase.database().ref('campaigns').child(key).update({
          imageUrl: downloadURL,
          filename: 'campaigns/' + key + ext
        });
        commit('setLoading', false, { root: true });
        commit('modal/toggleModal', null, { root: true });
        commit('updateCampaign', { ...payload, id: key, imageUrl: downloadURL, filename: 'campaigns/' + key + ext });
      } catch (error) {
        commit('setLoading', false, { root: true });
        commit('setError', error.message, { root: true });
      }
    },

    /* This action is for loading kickstar campaigns from elastic search engine corresponding the title we type */
    async loadCampaignsTitles ({ commit, state }, payload) {
      const matchParam = {
        match: {
          title: payload.title
        }
      };
      const data = JSON.stringify(setQueryParamas(10, 'kickstarter', matchParam));
      try {
        const response = await axios.post(CROSSPROM_URL, data, { headers: CROSSPROM_HEADERS });
        const responseData = response.data;
        const hits = responseData.hits.hits.filter(item => {
          return state.titlesToNotLoad.indexOf(item._source.title) === -1;
        }).map(el => ({
          hitId: el._id,
          title: el._source.title
        }));
        commit('setCampaignTitles', hits);
      } catch (error) {
        commit('setError', error.message, { root: true });
      }
    },

    /* This action is for loading all campaigns we saved in the firebase database,
    * then using each campaign hitId
    * to fetch its additional data from elastic search engine
    *
    * */
    async loadCampaigns ({ commit }) {
      commit('setLoading', true, { root: true });
      try {
        const data = await firebase.database().ref('campaigns').once('value');
        const campaigns = [];
        const obj = data.val();
        const ids = [];
        for (const key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            ids.push(obj[key].hitId);
            campaigns.push({
              id: key,
              title: obj[key].title,
              hitId: obj[key].hitId,
              description: obj[key].description,
              imageUrl: obj[key].imageUrl,
              authorName: obj[key].authorName,
              authorId: obj[key].authorId,
              filename: obj[key].filename,
              url: obj[key].url
            });
            commit('addTitleForUniqueness', obj[key].title);
          }
        }

        const filter = {
          ids: {
            values: ids
          }
        };

        const params = JSON.stringify(setQueryParamas(null, 'kickstarter', null, filter));
        const response = await axios.post(CROSSPROM_URL, params, { headers: CROSSPROM_HEADERS });
        const responseData = response.data;
        const hits = responseData.hits.hits.map((item, index) => ({
          ...campaigns[index],
          backers: item._source.backers,
          state: item._source.state
        }));
        commit('setCampaigns', hits.reverse());
        commit('setLoading', false, { root: true });
      } catch (error) {
        commit('setLoading', false, { root: true });
        commit('setError', error.message, { root: true });
      }
    }
  },
  getters: {
    campaigns: state => state.campaigns,
    campaign: state => state.campaign,
    campaignsTitlesList: state => state.campaignsTitlesList
  }
};
