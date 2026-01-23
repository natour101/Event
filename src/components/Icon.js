import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const iconFamilies = {
  material: MaterialCommunityIcons,
  fa5: FontAwesome5,
};

export default function Icon({ family = 'material', name, size = 18, color }) {
  const IconComponent = iconFamilies[family] || MaterialCommunityIcons;
  return <IconComponent name={name} size={size} color={color} />;
}
