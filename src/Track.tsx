import * as React from 'react';
import * as d3 from 'd3';
var Spotify = require('spotify-web-api-js');
const spotifyApi = new Spotify();

export interface ITrack {
  id: string
  name: string
  album: {
    images: Array<{ url: string }>
  }
}

interface IState {
  track: ITrack | null
  trackFeatures: {} | null
  trackAnalysis: {
    segments: Array<{
      confidence: number
    }>
  } | null
}
export default class Track extends React.Component<{}, IState> {
  chartRef;
  getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    e = r.exec(q)
    while (e) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
       e = r.exec(q);
    }
    return hashParams;
  }
  constructor(props){
    super(props);
    const params: { access_token?: string } = this.getHashParams();
    console.log(params)
    const token = params.access_token
    if (token) {
      spotifyApi.setAccessToken(token)
    }
    
  }
  state: IState = {
    track: null,
    trackFeatures: null,
    trackAnalysis: null,
  }
  async componentWillMount() {
    const params: { track_id?: string } = this.getHashParams();
    console.log(params)
    const trackId = params.track_id
    const track = await spotifyApi.getTrack(trackId)
    const trackFeatures = await spotifyApi.getAudioFeaturesForTrack(trackId)
    const trackAnalysis = await spotifyApi.getAudioAnalysisForTrack(trackId)
    this.setState({ track, trackFeatures, trackAnalysis })
  }

  componentDidMount() {
    this.createBarChart()
  }

  componentDidUpdate() {
    this.createBarChart()
  }

  createBarChart() {
    if (this.state.trackAnalysis) {
      const confidenceArr = this.state.trackAnalysis.segments.map(section => section.confidence)
      const dataMax = d3.max(confidenceArr)
      const yScale = d3.scaleLinear()
        .domain([0, dataMax])
        .range([0, 300])
      console.log(confidenceArr, dataMax, yScale)
      d3.select(this.chartRef)
        .selectAll('rect')
        .data(confidenceArr)
        .enter()
        .append('rect')

      d3.select(this.chartRef)
        .selectAll('rect')
        .data(confidenceArr)
        .exit()
        .remove()

      d3.select(this.chartRef)
        .selectAll('rect')
        .data(confidenceArr)
        .style('fill', '#fe9922')
        .attr('x', (_,i) => i * 5)
        .attr('y', d => 300 - yScale(d))
        .attr('height', d => yScale(d))
        .attr('width', 5)
  
    }
  }

  render() {
    console.log(this.state)
    const mainImage = this.state.track && this.state.track.album.images[0]
    return (
      <div>
        {this.state.track && (
          <div>
            {mainImage && <img src={mainImage.url} height={160} />}
            <div>{this.state.track.name}</div>
            {this.state.trackAnalysis && 
              <svg ref={ref => this.chartRef = ref} width={this.state.trackAnalysis.segments.length * 5} height={300}></svg>
            }
          </div>
        )}
      </div>
    )
  }
}