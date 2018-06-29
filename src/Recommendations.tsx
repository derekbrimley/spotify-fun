import * as React from 'react';
import * as qs from 'qs';
import TrackBox from './components/TrackBox';

var Spotify = require('spotify-web-api-js');
const spotifyApi = new Spotify();


interface IState {
  recommendations: Array<any> | null
  accessToken: string | null
}
export default class Recommendations extends React.Component<{}, IState> {
  constructor(props){
    super(props);
    const params: { access_token?: string } = qs.parse(window.location.hash.substr(1));
    console.log(params)
    const token = params.access_token
    this.state = {
      recommendations: null,
      accessToken: token
    }
    if (token) {
      spotifyApi.setAccessToken(token)
    }
  }

  getRecommendations = async () => {
    const topArtists = await spotifyApi.getMyTopArtists({ time_range: 'long_term' })
    const topArtistIds = topArtists.items.map(artist => artist.id).slice(0, 5).join(',')
    const seeds = {
      seed_artists: topArtistIds,
      market: 'US',
    }
    const res = await spotifyApi.getRecommendations(seeds)
    this.setState({ recommendations: res.tracks })
  }
  render() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <button onClick={this.getRecommendations}>Get Recommendations</button>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {this.state.recommendations && this.state.recommendations.map(track => (
            <TrackBox key={track.id} accessToken={this.state.accessToken} track={track} />
          ))}
        </div>
      </div>
    )
  }
}