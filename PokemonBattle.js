import React, { useState, useEffect } from "react";

const PokemonBattle = () => {
  const [card1, setCard1] = useState(null);
  const [card2, setCard2] = useState(null);
  const [winner, setWinner] = useState(null);
  const [isBattleInProgress, setIsBattleInProgress] = useState(false); // New state for battle progress

  // Fetch a random card from PokeAPI
  const fetchCard = async () => {
    try {
      const randomId = Math.floor(Math.random() * 898) + 1;
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
      const data = await response.json();
  
      console.log(data);
      return {
        name: data.name,
        hp: data.stats.find(stat => stat.stat.name === "hp").base_stat,
        imageUrl: data.sprites.front_default,
      };
    } catch (error) {
      console.error("Error fetching card:", error);
      return null;
    }
  };

  // Start the battle, fetch two new cards, and compare HP
  const getBattleResult = async () => {
    if (isBattleInProgress) return;  // Prevent multiple battle clicks

    setIsBattleInProgress(true);  // Start the battle
    const newCard1 = await fetchCard();
    const newCard2 = await fetchCard();

    // If cards failed to load, handle the error
    if (!newCard1 || !newCard2) {
      setWinner("Failed to load cards. Try again!");
      setIsBattleInProgress(false);
      return;
    }

    // Set the fetched cards and compare HP
    setCard1(newCard1);
    setCard2(newCard2);

    const hp1 = newCard1.hp ? parseInt(newCard1.hp) : 0;
    const hp2 = newCard2.hp ? parseInt(newCard2.hp) : 0;

    if (hp1 > hp2) {
      setWinner(`${newCard1.name} wins!`);
    } else if (hp2 > hp1) {
      setWinner(`${newCard2.name} wins!`);
    } else {
      setWinner("It's a tie!");
    }

    setIsBattleInProgress(false);  // End the battle
  };

  useEffect(() => {
    getBattleResult();  // Trigger the first battle on component mount
  }, []);  // Empty dependency array to run only once on mount

  return (
    <div className="pokemon-battle">
      <div>
        {card1 && (
          <div>
            <h2>{card1.name}</h2>
            <img src={card1.imageUrl} alt={card1.name} />
            <p>HP: {card1.hp}</p>
          </div>
        )}
      </div>
      <div>
        {card2 && (
          <div>
            <h2>{card2.name}</h2>
            <img src={card2.imageUrl} alt={card2.name} />
            <p>HP: {card2.hp}</p>
          </div>
        )}
      </div>
      <div>
        {winner && <h3>{winner}</h3>}
      </div>
      <button onClick={getBattleResult} disabled={isBattleInProgress}>
        {isBattleInProgress ? "Battle in Progress..." : "Battle Again!"}
      </button>
    </div>
  );
};

export default PokemonBattle;
