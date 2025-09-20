import { useEffect, useState, useRef } from "react";
import { fetchArticles } from "../Utils/api";
import { adaptArticles } from '../Utils/helpers';
import { Link } from "react-router-dom";
import pexels from "../Images/Pexels_logo.svg";

export default function IndexPage() {
  const [articles, setArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const hasFetched = useRef(false);

  const getIndexArticles = async () => {
    try {
      const request = await fetchArticles(6);
      const adaptedArticles = adaptArticles(request.articles);
      setArticles(adaptedArticles);
    } catch (err) {
      console.error("Failed to fetch articles:", err);
    }
  };

  useEffect(() => {
    if (!hasFetched.current) {
      getIndexArticles();
      hasFetched.current = true;
    }
  }, []);

  const articlesToDisplay = articles.slice(currentPage, currentPage + 3);

  const handleNext = () => {
    setCurrentPage(prevPage => Math.min(prevPage + 3, articles.length - 3));
  };

  const handlePrevious = () => {
    setCurrentPage(prevPage => Math.max(prevPage - 3, 0));
  };

  const handleLinkClick = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <>
      <main className="wrapper-index">
        <section>
          <div className="index-wrapper-latest">
            {articlesToDisplay.length > 0 ? (
              articlesToDisplay.map((item) => (
                <Link
                  to={`/content/main/latest/${item.Id}`}
                  className='wrapper-index-link'
                  key={item.Id}
                >
                  {/* Conditionally render image only if valid */}
                  {item.ImagePlaceholder && item.ImagePlaceholder !== "/Images/logo192.png" ? (
                    <div className="img-index-link">
                      <img src={item.ImagePlaceholder} alt={item.TopicName} />
                    </div>
                  ) : null}

                  <div className="wrapper-index-link-cnt">
                    <h3>{item.TopicName}</h3>
                    <span>
                      <i>Posted by:</i> <b>{item.Author}</b>
                      <span>
                        <i className="bi bi-chat-dots-fill"></i>
                        {item.NumberPosts}
                      </span>
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="spinner"></div>
            )}
          </div>
          <div className="wrapper-index-tgle-btn">
            <button onClick={handlePrevious} disabled={currentPage === 0}>
              <i className="bi bi-chevron-left"></i>
            </button>
            <button onClick={handleNext} disabled={currentPage >= articles.length - 3}>
              <i className="bi bi-chevron-right"></i>
            </button>
          </div>
        </section>

        <section>
          <Link onClick={handleLinkClick} className="link-removelink" to={"/content/main/latest"}>
            <div className="signup-index btn-flow-idx">
              Start Exploring
              <i className="bi bi-arrow-right-circle-fill fs-3"></i>
            </div>
          </Link>
        </section>

        <section className="join-us-wrapper about-index">
          <h1>
            The Slow Content Community
          </h1>
          <h3>
            Your place for mindful publishing.
          </h3>
          <p>
            Planetarium.com is an open publishing platform where anyone can join and share their voice. Simply sign up with your email and password to start writing articles that contribute to the collective stream of content.
          </p>
          <p>
            You can explore a wide range of topics and engage with the community through comments.
          </p>
        </section>

        <section className="wrapper-pexels-idx join-us-wrapper">
          <div>
            <h2>
              Powered by the Pexels API.
            </h2>
            <h4>
              Start publishing with your own images or use the <u>integrated pexels api</u> to add vibrant and colorful images to your articles.
            </h4>
            <p>
              There are no limits to the ammount of images that you can upload.
            </p>
          </div>

          <img src={pexels} alt="" />
        </section>

        <section className="join-us-wrapper">
          <h3>
            Easy To Get Started!
          </h3>
          <p>
            Setting up an account and starting to publish is very easy. Email and password and you are there!
          </p>
          <Link onClick={handleLinkClick} to={"/auth"} className="link-removelink">
            <div className="signup-index">
              Get started
            </div>
          </Link>
        </section>
      </main>
    </>
  );
}
