import React, { useState } from "react";
import WelcomeScreen from "./pages/WelcomeScreen";
import styled from "styled-components";
import "./index.css";
import pageType from "./models/pageType";
import GameScreen from "./pages/GameScreen";

const AppContainer = styled.div`
  padding: 20px;
`;

const usePage = () => {
  const [currentPage, setCurrentPage] = useState(pageType.GAME_SCREEN);

  const changePage = (pageType) => {
    setCurrentPage(pageType);
  };

  const goToGame = () => {
    changePage(pageType.GAME_SCREEN);
  };

  return [currentPage, goToGame];
};

const App = () => {
  const [currentPage, goToGame] = usePage();

  let page = null;

  if (currentPage === pageType.MAIN_SCREEN) {
    page = (
      <WelcomeScreen
        onPlayAgainstComputer={() => goToGame()}
        onPlayAgainstFriend={() => goToGame()}
        onCreateRoom={() => goToGame()}
      />
    );
  } else if (currentPage === pageType.GAME_SCREEN) {
    page = <GameScreen />;
  }

  return <AppContainer>{page}</AppContainer>;
};

export default App;
