import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './index';

/** Typed dispatch — use throughout instead of plain useDispatch. */
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
/** Typed selector — use throughout instead of plain useSelector. */
export const useAppSelector = useSelector.withTypes<RootState>();
