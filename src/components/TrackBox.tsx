import * as React from 'react';
import { ITrack } from '../Track';

interface ITrackBoxProps {
  track: ITrack
  accessToken: string
  onClick?: (track: ITrack) => void
}
const TrackBox: React.SFC<ITrackBoxProps> = props => {
  console.log(props.track, props.track.preview_url)
  const mainImage = props.track.album.images[0]
  return (
    <div>
      <div style={{ padding: 16, cursor: 'pointer' }}
        onClick={() => {location.href=`http://localhost:3000?page=track#access_token=${props.accessToken}&track_id=${props.track.id}`}}
      >
        {mainImage && <img src={mainImage.url} height={160} />}
        <div>{props.track.name}</div>
        
      </div>
      {props.track.preview_url &&
        <audio id="myAudio" controls>
          <source src={props.track.preview_url} type="audio/mp3" />
          Your browser does not support the audio element.
        </audio>
      }
    </div>
  )
}

export default TrackBox