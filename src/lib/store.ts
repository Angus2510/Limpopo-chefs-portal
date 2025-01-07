import type { Action, ThunkAction } from "@reduxjs/toolkit";
import { combineSlices, configureStore } from "@reduxjs/toolkit";
import { studentsApiSlice } from "./features/students/studentsApiSlice";
import { campusApiSlice } from "./features/campus/campusApiSlice";
import { intakeGroupsApiSlice } from "./features/intakegroup";
import { learningMaterialApiSlice } from "./features/learningmaterial/learningMaterialApiSlice";
import { outcomesApiSlice } from "./features/outcome/outcomeApiSlice";
import authSliceReducer from "./features/auth/authSlice";
import { apiSlice } from "@/app/api/apiSlice";
import searchSlice from "./features/search/searchSlice";

const rootReducer = combineSlices(
  studentsApiSlice,
  campusApiSlice,
  intakeGroupsApiSlice,
  learningMaterialApiSlice,
  outcomesApiSlice,
  {
    auth: authSliceReducer,
    api: apiSlice.reducer,
    search: searchSlice,
  }
);

export type RootState = ReturnType<typeof rootReducer>;

export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware().concat(apiSlice.middleware);
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore["dispatch"];
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>;
