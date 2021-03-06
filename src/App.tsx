import * as React from 'react';
import './App.css';
var Spotify = require('spotify-web-api-js');
const spotifyApi = new Spotify();
// import logo from './logo.svg';
// import { of } from 'rxjs/observable/of';
import TrackBox from './components/TrackBox';
import * as qs from 'qs';
import { ITrack } from './Track';


interface IArtistBox {
  artist: {
    id: string
    name: string
    images: Array<{
      url: string
      height: number
      width: number
    }>
  }
  onClick?: (artistId: string) => void
}
const ArtistBox: React.SFC<IArtistBox> = props => {
  const mainImage = props.artist.images[0]
  return (
    <div style={{ padding: 16, cursor: 'pointer' }} onClick={() => props.onClick(props.artist.id)} >
      {mainImage && <img src={mainImage.url} height={160} />}
      <div>{props.artist.name}</div>
    </div>
  )
}

interface IState {
  accessToken: string
  loggedIn: boolean
  topArtists: Array<any>
  searchText: string
  searchedArtists: Array<any>
  relatedArtistMap: {}
  selectedArtist: {
    artistId: string
    tracks: ITrack[]
  } | null
  selectedTrack: {
    id: string
  } | null
}
class App extends React.Component<any, IState> {
  // getHashParams() {
  //   var hashParams = {};
  //   var e, r = /([^&;=]+)=?([^&;]*)/g,
  //       q = window.location.hash.substring(1);
  //   e = r.exec(q)
  //   while (e) {
  //      hashParams[e[1]] = decodeURIComponent(e[2]);
  //      e = r.exec(q);
  //   }
  //   return hashParams;
  // }
  constructor(props){
    super(props);
    const params: { access_token?: string } = qs.parse(window.location.hash.substr(1));
    const token = params.access_token;
    if (token) {
      spotifyApi.setAccessToken(token);
    }
    this.state = {
      accessToken: token,
      loggedIn: token ? true : false,
      topArtists: [],
      searchText: '',
      searchedArtists: [],
      relatedArtistMap: {},
      selectedArtist: null,
      selectedTrack: null,
    }
  }

  getTopArtists = async () => {
    const res = await spotifyApi.getMyTopArtists({ time_range: 'long_term' })
    console.log(res)
    this.setState({ topArtists: res.items })
  }


  searchArtist = async () => {
    const res = await spotifyApi.searchArtists(this.state.searchText)
    console.log(res)
    this.setState({ searchedArtists: res.artists.items })
  }
  getRelatedArtists = async (artistId) => {
    const res = await spotifyApi.getArtistRelatedArtists(artistId)
    console.log(res)
    this.setState(prevState => ({ relatedArtistMap: { ...prevState.relatedArtistMap, [artistId]: res.artists } }))
  }
  onClickArtist = async (artistId) => {
    const res = await spotifyApi.getArtistTopTracks(artistId, 'US')
    console.log(res)
    this.setState({ selectedArtist: { artistId, tracks: res.tracks }})
  }
  handleTrackClick = async (track) => {
    this.setState({ selectedTrack: track })
  }
  flexWrapStyle: React.CSSProperties = { display: 'flex', flexWrap: 'wrap' }
  topTabStyle: React.CSSProperties = { width: 200, cursor: 'pointer',  }
  public render() {
    return (
      <div className="App">
        <div style={{ height: 64, display: 'flex', justifyContent: 'center' }}>
          <div style={this.topTabStyle} onClick={() => this.setState({ selectedArtist: null })}>
            Home
          </div>
          <div style={this.topTabStyle}
            onClick={() => {window.location.href = `http://localhost:3000?page=recommendations#access_token=${this.state.accessToken}`}}
          >
            Recommendations
          </div>
        </div>
        <a href='http://localhost:8888'>Login to Spotify</a>
        
        {this.state.loggedIn &&
          this.state.selectedArtist ? (
            <div>
              {this.state.selectedArtist.tracks[0].artists[0].name}
              <div style={this.flexWrapStyle}>
                {this.state.selectedArtist.tracks.map(track => (
                  <TrackBox key={track.id} accessToken={this.state.accessToken} track={track} onClick={this.handleTrackClick}/>
                ))}
                {this.state.selectedTrack &&
                  <a href={`http://localhost:3000?page=track#access_token=${this.state.accessToken}&track_id=${this.state.selectedTrack.id}`}>
                    Go to track
                  </a>
                }
              </div>
            </div>
          ) : (
            <>
              <div>
                <button onClick={this.getTopArtists}>Get top artists</button>
                {this.state.topArtists.length > 0 && (
                  <div style={this.flexWrapStyle}>
                    {this.state.topArtists.map(artist => (
                      <ArtistBox key={artist.id} artist={artist} onClick={this.onClickArtist}/>
                    ))}
                  </div>
                )}
              </div>
              <input type='text' onChange={ev => this.setState({ searchText: ev.target.value })} />
              <button onClick={this.searchArtist}>
                Search
              </button>
              <div>
                {this.state.searchedArtists.map(artist => {
                  const relatedArtists = this.state.relatedArtistMap[artist.id]
                  console.log(artist, relatedArtists)
                  return (
                    <div key={artist.id} >
                      <ArtistBox artist={artist} onClick={this.onClickArtist}/>
                      {relatedArtists ? (
                        <div style={this.flexWrapStyle}>
                          {relatedArtists.map(relArtist => (
                            <ArtistBox key={relArtist.id} artist={relArtist} />
                          ))}
                        </div>
                      ) : (
                        <button onClick={() => this.getRelatedArtists(artist.id)}>Get related artists</button>
                      )}
                    </div>
                  )
                })}
              </div>
            </>
          )
        }
      </div>
    );
  }
}

export default App;
