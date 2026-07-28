import {
  HiOutlineHashtag,
  HiOutlineHome,
  HiOutlinePhotograph,
  HiOutlineUserGroup,
} from "react-icons/hi";

// value is passed straight to the iTunes search API as a term, so it has to
// read like something a person would type - not a Shazam genre code.
export const genres = [
  { title: "Pop", value: "pop" },
  { title: "Hip-Hop", value: "hip hop" },
  { title: "Dance", value: "dance" },
  { title: "Electronic", value: "electronic" },
  { title: "Soul", value: "soul r&b" },
  { title: "Alternative", value: "alternative" },
  { title: "Rock", value: "rock" },
  { title: "Latin", value: "latin" },
  { title: "Film", value: "soundtrack" },
  { title: "Country", value: "country" },
  { title: "Worldwide", value: "world music" },
  { title: "Reggae", value: "reggae dancehall" },
  { title: "House", value: "house" },
  { title: "K-Pop", value: "k-pop" },
];

export const links = [
  { name: "Discover", to: "/", icon: HiOutlineHome },
  { name: "Around You", to: "/around-you", icon: HiOutlinePhotograph },
  { name: "Top Artists", to: "/top-artists", icon: HiOutlineUserGroup },
  { name: "Top Charts", to: "/top-charts", icon: HiOutlineHashtag },
];
