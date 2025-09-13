"use client"

import styles from "./WalkRoulette.module.css";
import buttonStyles from "@/styles/buttons.module.css";

import { useState } from "react";

import walksJson from "@/data/walks.json";
import type Walk from "@/types/Walk";

import WalkCard from "@/components/WalkCard/WalkCard";


export default function WalkRoulette() {

  const [currentWalkIndex, setCurrentWalkIndex] = useState<number|undefined>();
  const [usedIndexes, setUsedIndexes] = useState<number[]>([]);

  const walks = (walksJson as unknown as Walk[]);

  function getRandomWalk() {
    let walkIndex : number;
    do {
      walkIndex = Math.floor(Math.random() * walks.length)
    } while (usedIndexes.includes(walkIndex))

    setCurrentWalkIndex(walkIndex)
    if (usedIndexes.length < walks.length - 1) {
      setUsedIndexes(prev => [...prev, walkIndex])
    }
    else {
      setUsedIndexes([])
    }
  }


  return (
    <div className={styles.roulette}>
      {currentWalkIndex !== undefined && 
        <div className={styles.walk}>
          <WalkCard walk={walks[currentWalkIndex]} />
        </div>
      }
      <button
        className={`${buttonStyles.button}`}
        onClick={getRandomWalk}
      >
        {currentWalkIndex === undefined
          ? "Get a random walk"
          : "Find a different random walk"
        }
      </button>
    </div>
  )
}