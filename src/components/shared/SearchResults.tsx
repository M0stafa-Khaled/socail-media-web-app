import { Models } from "appwrite";
import Loader from "./Loader";
import GridPostsList from "./GridPostsList";

interface IProps {
  isSearchFetching: boolean;
  searchedPosts: Models.Document[];
}

const SearchResults = ({ isSearchFetching, searchedPosts }: IProps) => {
  if (isSearchFetching) return <Loader />;
  else if (searchedPosts.length > 0)
    return <GridPostsList posts={searchedPosts} />;
  else return <p className="text-light">No result found</p>;
};

export default SearchResults;
