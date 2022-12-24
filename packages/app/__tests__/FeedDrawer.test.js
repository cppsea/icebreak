import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { render, screen, fireEvent } from '@testing-library/react-native';

import FeedDrawer from '../screens/feed/FeedDrawer';

describe('Testing react navigation', () => {
  test('screen contains a button linking to the notifications page', async () => {
    const component = (
      <NavigationContainer>
        <FeedDrawer />
      </NavigationContainer>
    );

    render(component);
    const button = await screen.findByText('Go to notifications');

    expect(button).toBeTruthy();
  });

  test('clicking on the button takes you to the notifications screen', async () => {
    const component = (
      <NavigationContainer>
        <FeedDrawer />
      </NavigationContainer>
    );

    render(component);
    const oldScreen = screen.queryByText('Welcome!');
    const button = await screen.findByText('Go to notifications');

    expect(oldScreen).toBeTruthy();

    fireEvent(button, 'press');
    const newScreen = await screen.findByText('This is the notifications screen');

    expect(newScreen).toBeTruthy();
  });
});