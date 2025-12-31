// Utility for managing TradingView chart markers
// Note: TradingView widget API has limited support for programmatic markers
// This is a placeholder for future implementation using TradingView's advanced features

export interface ChartMarker {
  time: number; // Unix timestamp
  position: 'aboveBar' | 'belowBar' | 'inBar';
  color: string;
  shape: 'circle' | 'square' | 'arrowUp' | 'arrowDown';
  text: string;
  size: number;
}

export interface TradeSignal {
  timestamp: string;
  price: number;
  recommendation: 'LONG' | 'SHORT' | 'HOLD' | 'EXIT';
  position_status?: 'ENTRY' | 'EXIT' | 'HOLD';
}

export const createMarkerFromSignal = (signal: TradeSignal): ChartMarker => {
  const time = new Date(signal.timestamp).getTime() / 1000; // Convert to Unix timestamp
  
  let color = '#888';
  let shape: 'circle' | 'square' | 'arrowUp' | 'arrowDown' = 'circle';
  let position: 'aboveBar' | 'belowBar' | 'inBar' = 'aboveBar';
  let text = signal.recommendation;

  if (signal.position_status === 'ENTRY') {
    if (signal.recommendation === 'LONG') {
      color = '#26a69a'; // Green
      shape = 'arrowUp';
      position = 'belowBar';
      text = 'ENTRY LONG';
    } else if (signal.recommendation === 'SHORT') {
      color = '#ef5350'; // Red
      shape = 'arrowDown';
      position = 'aboveBar';
      text = 'ENTRY SHORT';
    }
  } else if (signal.position_status === 'EXIT') {
    color = '#ffa726'; // Orange
    shape = 'square';
    position = 'inBar';
    text = 'EXIT';
  } else if (signal.recommendation === 'LONG') {
    color = '#26a69a';
    shape = 'circle';
    position = 'belowBar';
  } else if (signal.recommendation === 'SHORT') {
    color = '#ef5350';
    shape = 'circle';
    position = 'aboveBar';
  }

  return {
    time,
    position,
    color,
    shape,
    text,
    size: 1,
  };
};

// For storing markers to display
export class ChartMarkerManager {
  private markers: ChartMarker[] = [];

  addMarker(marker: ChartMarker) {
    this.markers.push(marker);
  }

  getMarkers(): ChartMarker[] {
    return [...this.markers];
  }

  clearMarkers() {
    this.markers = [];
  }

  // Convert markers to a format that can be used with TradingView
  getMarkersData() {
    return this.markers.map((marker) => ({
      time: marker.time,
      position: marker.position,
      color: marker.color,
      shape: marker.shape,
      text: marker.text,
      size: marker.size,
    }));
  }
}

