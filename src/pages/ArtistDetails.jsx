

import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { DetailsHeader, Error, Loader, RelatedSongs } from '../components'; 
import { useGetArtistDetailsQuery } from '../redux/services/shazamCore';



const ArtistDetails = () => {
const { id: artistId } = useParams();
// data from the state
const { setActiveSong, isPlaying } = useSelector( (state) => state.player);
const { data: artistData, isFetching: isFetchingArtisDetails, error} = useGetArtistDetailsQuery( artistId);
// loading and error handlers
if( isFetchingArtisDetails) return <Loader title='Loading artist details'/>;
if (error) return <Error />;

return (
<div className='flex flex-col'> 
    <DetailsHeader artistId ={artistId} artistData={artistData} />
  
<RelatedSongs 
    data={Object.values(artistData?.songs)}
    artistId ={artistId}
    isPlaying={isPlaying}
    setActiveSong={setActiveSong}

/>

</div>

);

};

export default ArtistDetails;
