import styled, { css } from "styled-components";

export const mobileBreakpoint = "460px";

export const tabletBreakpoint = "740px";

export const baseHeadingStyles = css`
  text-align: center;
  white-space: pre-line;
`;

export const Button = styled.button`
  /* override paper.css margin */
  @media (max-width: 520px) {
    margin-bottom: unset;
  }
`;
