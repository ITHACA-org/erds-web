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
              <ColorMapEntry color="#c4dffc" quantity="10" opacity="0"/>
              <ColorMapEntry color="#2b7493" quantity="25"/>
              <ColorMapEntry color="#51ae92" quantity="50"/>
              <ColorMapEntry color="#7dc48e" quantity="75"/>
              <ColorMapEntry color="#b2e0a6" quantity="100"/>
              <ColorMapEntry color="#d1ecb0" quantity="125"/>
              <ColorMapEntry color="#eff8ba" quantity="150"/>
              <ColorMapEntry color="#fef0ad" quantity="175"/>
              <ColorMapEntry color="#fdd28b" quantity="200"/>
              <ColorMapEntry color="#fdb569" quantity="225"/>
              <ColorMapEntry color="#f2854e" quantity="250"/>
              <ColorMapEntry color="#e44f35" quantity="275"/>
              <ColorMapEntry color="#d7191c" quantity="1000" label="mm"/>
            </ColorMap>
          </RasterSymbolizer>
        </Rule>
      </FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>
