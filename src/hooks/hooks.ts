import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {StateType, DispatchType} from "../store/store";


export const useAppDispatch = () => useDispatch<DispatchType>();
export const useAppSelector: TypedUseSelectorHook<StateType> = useSelector;