import React from 'react';

export const removeSpaceAndSpecialChar = (event: React.KeyboardEvent<HTMLInputElement>) => {
  if (!event.key.match(/[a-zA-Z0-9_,]/)) {
    event.preventDefault();
    return false;
  }
};

export const onlyNumber = (event: React.KeyboardEvent<HTMLInputElement>) => {
  if (!event.key.match(/[0-9_,]/) || event.key === "Backspace") {
    event.preventDefault();
    return false;
  }
};
