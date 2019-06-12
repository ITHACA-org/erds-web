<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/sld
http://schemas.opengis.net/sld/1.0.0/StyledLayerDescriptor.xsd" version="1.0.0">
  <NamedLayer>
    <Name>AccumulatedPrecipitation</Name>
    <UserStyle>
      <Title>Accumulated Precipitation</Title>
      <FeatureTypeStyle>
        <Rule>
          <RasterSymbolizer>
            <ColorMap type="intervals">
              <ColorMapEntry color="#c4dffc" quantity="25" opacity="0"/>
              <ColorMapEntry color="#c4dffc" quantity="50"/>
              <ColorMapEntry color="#6aa9ea" quantity="75"/>
              <ColorMapEntry color="#4588cd" quantity="100"/>
              <ColorMapEntry color="#95ea95" quantity="125"/>
              <ColorMapEntry color="#4eca7c" quantity="150"/>
              <ColorMapEntry color="#008e5b" quantity="200"/>
              <ColorMapEntry color="#ffff00" quantity="250"/>
              <ColorMapEntry color="#ffc700" quantity="300"/>
              <ColorMapEntry color="#ff9100" quantity="350"/>
              <ColorMapEntry color="#ff0000" quantity="400"/>
              <ColorMapEntry color="#c6037e" quantity="450"/>
              <ColorMapEntry color="#713697" quantity="3000" label="mm"/>
            </ColorMap>
          </RasterSymbolizer>
        </Rule>
      </FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>
