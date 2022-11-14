import { useNavigate } from "react-router-dom";

const ArtistCard = ( {track}) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col w-[250px] p-4 bg-white/5 bg-opcity-80 backdrop-blur-sm animate-slideup rounded-lg cursor-pointer"
    onClick={ () => navigate( `/artists/${track?.artists[0].adamid}`)}
    >

      <img alt="artist" src={track?.images?.coverart } 
      className="w-full h-56 rounded-lg"/>
    </div>


  )
};

export default ArtistCard;
