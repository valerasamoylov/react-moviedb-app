import React, { useEffect, useState, useRef } from "react";
import { Typography, Row } from "antd";
import { API_URL, API_KEY, IMAGE_BASE_URL, POSTER_SIZE } from "../../../config";
import GridCard from "../../../commons/GridCards";

const { Title } = Typography;

function Similar_Movies() {
  const buttonRef = useRef(null);

  const [Movies, setMovies] = useState([]);
  const [MainMovieImage, setMainMovieImage] = useState(null);
  const [Loading, setLoading] = useState(true);
  const [CurrentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const endpoint = `${API_URL}movie/${movieId}/similar?api_key=${API_KEY}&language=en-US&page=1`;
    fetchMovies(endpoint);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
  }, []);

  const fetchMovies = endpoint => {
    fetch(endpoint)
      .then(result => result.json())
      .then(result => {
        setMovies([...Movies, ...result.results]);
        setMainMovieImage(MainMovieImage || result.results[0]);
        setCurrentPage(result.page);
      }, setLoading(false))
      .catch(error => console.error("Error:", error));
  };

  const loadMoreItems = () => {
    let endpoint = "";
    setLoading(true);
    console.log("CurrentPage", CurrentPage);
    endpoint = `${API_URL}movie/${movieId}/similar?api_key=${API_KEY}&language=en-US&page=${CurrentPage +
      1}`;
    fetchMovies(endpoint);
  };

  const handleScroll = () => {
    const windowHeight =
      "innerHeight" in window
        ? window.innerHeight
        : document.documentElement.offsetHeight;
    const body = document.body;
    const html = document.documentElement;
    const docHeight = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
    );
    const windowBottom = windowHeight + window.pageYOffset;
    if (windowBottom >= docHeight - 1) {
      console.log("clicked");
      buttonRef.current.click();
    }
  };

  return (
    <div style={{ width: "100%", margin: "0" }}>
      <div style={{ width: "85%", margin: "1rem auto" }}>
        <Title level={2}> Similar_Movies </Title>
        <hr />
        <Row gutter={[16, 16]}>
          {Movies &&
            Movies.filter((movie, index) => (
              <React.Fragment key={index}>
                <GridCard
                  image={
                    movie.poster_path
                      ? `${IMAGE_BASE_URL}${POSTER_SIZE}${movie.poster_path}`
                      : null
                  }
                  movieId={movie.id}
                  movieName={movie.original_title}
                />
              </React.Fragment>
            ))}
        </Row>

        {Loading && <div>Loading...</div>}

        <br />
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button ref={buttonRef} className="loadMore" onClick={loadMoreItems}>
            Load More
          </button>
        </div>
      </div>
    </div>
  );
}

export default Similar_Movies;
