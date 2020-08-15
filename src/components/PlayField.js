import React from "react";
import ShipCell from "./ShipCell";

import styled from "styled-components";

const Table = styled.table`
  border-radius: 10px;
  margin: 0px 30px 30px 30px;
  border-collapse: collapse;
  border-spacing: 0;
`;

const PlayField = ({
  width,
  height,
  stateTable,
  onCellClicked,
  onCellHover,
  onCellRightClicked,
}) => {
  return (
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
  );
};

export default PlayField;
