import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch } from "./store";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// It creates pre-typed versions of the standard Redux hooks:

// Plain hook	What it does	Problem
// useDispatch()	returns Dispatch<AnyAction>	doesn't know about thunks, RTK Query mutations
// useSelector((s) => ...)	s is unknown	every component must type s: RootState manually
// Typed hook	What it does	Benefit
// useAppDispatch()	returns AppDispatch	knows all middleware-injected dispatch shapes
// useAppSelector((s) => ...)	s is RootState	autocompletes everywhere
// Use these everywhere in components instead of the raw hooks. Project rule: never useDispatch() or useSelector() directly — only useAppDispatch and useAppSelector. That's the convention recommended in the official Redux+TS docs.
