import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

//Define the store
export const userStore = create(
    persist(
        (set) => ({
            username: "", //state variable
            updateName: (username) => set({ username }), //function to update the state variable
        }),
        {
            name: 'mystore', //name of the store
            storage: createJSONStorage(() => sessionStorage) //storage type
        }
    )
);

/*
Our store is called userStore and is created using function create imported from zustand.
The store has one state variable called username and a function called updateName to receive
new value for the state variable and update it. In this code, we also use persist to
persistently save our store's data. Persist is imported from zustand/middleware. In this
example, we selected sessionStorage as the place to persist the store.
*/