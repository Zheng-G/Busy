import keyBy from 'lodash/keyBy';
import omit from 'lodash/omit';

import * as actions from './userActions';

const initialState = {
  // Map<FilePublicId, File>
  files: {},
  // Whether a file is uploading.
  // Map<FileName, Bool>
  fileUploadIsLoading: {},
  fileUploadError: null,
  filesFetchError: null,
  filesFetchIsLoading: true,
  following: {
    list: [],
    isFetching: false,
  },
  votePower: 100,
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case actions.UPLOAD_FILE_START: {
      return Object.assign({}, state, {
        fileUploadIsLoading: Object.assign({}, state.fileUploadIsLoading, {
          [`${action.meta.filename}`]: true,
        }),
        fileUploadError: null,
      });
    }

    case actions.UPLOAD_FILE_SUCCESS: {
      return Object.assign({}, state, {
        files: Object.assign({}, state.files, {
          [`${action.payload.public_id}`]: action.payload,
        }),
        fileUploadIsLoading: omit(state.fileUploadIsLoading, [
          action.meta.filename,
        ]),
        fileUploadError: null,
      });
    }

    case actions.UPLOAD_FILE_ERROR: {
      return Object.assign({}, state, {
        fileUploadIsLoading: omit(state.fileUploadIsLoading, [
          action.meta.filename,
        ]),
        fileUploadError: action.payload,
      });
    }

    case actions.FETCH_FILES_START: {
      return Object.assign({}, state, {
        filesFetchIsLoading: true,
        filesFetchError: null,
      });
    }

    case actions.FETCH_FILES_SUCCESS: {
      return Object.assign({}, state, {
        files: keyBy(action.payload, 'public_id'),
        filesFetchIsLoading: false,
        filesFetchError: null,
      });
    }

    case actions.FETCH_FILES_ERROR: {
      return Object.assign({}, state, {
        filesFetchIsLoading: false,
        filesFetchError: action.payload,
      });
    }
    case actions.GET_FOLLOWING_START:
      return {
        ...state,
        following: {
          list: [],
          isFetching: true,
        },
      };
    case actions.GET_FOLLOWING_ERROR:
      return {
        ...state,
        following: {
          list: [],
          isFetching: false,
        },
      };
    case actions.GET_FOLLOWING_SUCCESS:
      return {
        ...state,
        following: {
          list: action.payload,
          isFetching: false,
        },
      };
    case actions.FOLLOW_USER_START:
      return {
        ...state,
        following: {
          ...state.following,
          list: [
            ...state.following.list,
            action.meta.username,
          ],
        },
      };
    case actions.UNFOLLOW_USER_START:
      const targetIdx = state.following.list.indexOf(action.meta.username);
      const newList = [
        ...state.following.list.slice(0, targetIdx),
        ...state.following.list.slice(targetIdx + 1),
      ];
      return {
        ...state,
        following: {
          ...state.following,
          list: newList,
        },
      };
    case actions.UPDATE_VOTE_POWER_BAR:
      return { ...state, votePower: action.payload };
    default: {
      return state;
    }
  }
}
