import { Tabs } from 'expo-router';

import { PRIVATE_SCREENS, SCREEN_OPTIONS } from '@app/constants';
import { TAB_ICONS } from '@app/icons/TabIcons';

export default function TabLayout() {
  return (
    <Tabs
      initialRouteName="home"
      screenOptions={SCREEN_OPTIONS}
      backBehavior="history">
      <Tabs.Screen
        name="home"
        options={{
          title: PRIVATE_SCREENS.HOME,
          tabBarIcon: TAB_ICONS.HOME,
        }}
      />
      <Tabs.Screen
        name="wishlist"
        options={{
          title: PRIVATE_SCREENS.WISHLIST,
          tabBarIcon: TAB_ICONS.WISHLIST,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: PRIVATE_SCREENS.CART,
          tabBarIcon: TAB_ICONS.CART,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: PRIVATE_SCREENS.SEARCH,
          tabBarIcon: TAB_ICONS.SEARCH,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: PRIVATE_SCREENS.SETTINGS,
          tabBarIcon: TAB_ICONS.SETTINGS,
        }}
      />
    </Tabs>
  );
}
