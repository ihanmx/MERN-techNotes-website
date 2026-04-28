import { useState, useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";

const usePersist = (): [boolean, Dispatch<SetStateAction<boolean>>] => {
  const [persist, setPersist] = useState<boolean>(() => {
    const stored = localStorage.getItem("persist");
    return stored ? (JSON.parse(stored) as boolean) : false;
  });

  useEffect(() => {
    localStorage.setItem("persist", JSON.stringify(persist));
  }, [persist]);

  return [persist, setPersist];
};

export default usePersist;

//[boolean,Dispatch<SetStateAction<boolean>>] equals to persist and setpersist types
