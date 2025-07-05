import { create } from "zustand";

export enum Steps {
	USER,
	PHONE,
	BUSINESS,
	HOMECLUB,
}

type Store = {
	step: Steps;
	setStep: (step: Steps) => void;
	phoneSkipped: boolean;
	setPhoneSkipped: (skipped: boolean) => void;
	done: boolean;
	setDone: (done: boolean) => void;
};

export const useUser = create<Store>()((set) => ({
	step: Steps.USER,
	setStep: (step: Steps) => {
		set({ step });
	},
	phoneSkipped: false,
	setPhoneSkipped: (skipped: boolean) => {
		set({ phoneSkipped: skipped });
	},
	done: false,
	setDone: (done: boolean) => {
		set({ done });
	},
}));
