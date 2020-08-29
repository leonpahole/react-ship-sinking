import React from "react";
import ShipCell from "./ShipCell";

import styled from "styled-components";
import { tabletBreakpoint } from "../styles";

const Table = styled.table`
  width: unset;

  @media (min-width: ${tabletBreakpoint}) {
    margin: 0px 30px 30px 30px;
  }
`;

const PlayFieldContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const PlayerNameHeading = styled.h4`
  margin: unset;
  margin-bottom: 10px;
`;

const PlayField = ({
  width,
  height,
  stateTable,
  onCellClicked,
  onCellHover,
  onCellRightClicked,
  playerName,
}) => {
  return (
    <PlayFieldContainer>
      <PlayerNameHeading>{playerName}</PlayerNameHeading>
      <Table>
        <tbody>
          {Array.from({ length: width }, (_, y) => (
            <tr key={y}>
              {Array.from({ length: height }, (_, x) => (
                <ShipCell
                  key={x + "_" + y}
                  x={x}
                  y={y}
                  state={stateTable[x][y]}
                  onClick={(x, y) => onCellClicked && onCellClicked({ x, y })}
                  onHover={(x, y) => onCellHover && onCellHover({ x, y })}
                  onRightClick={(x, y) =>
                    onCellRightClicked && onCellRightClicked({ x, y })
                  }
                />
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </PlayFieldContainer>
  );
};

export default PlayField;
