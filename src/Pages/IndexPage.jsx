import { useEffect, useState, useRef } from "react";
import { fetchArticles } from "../Utils/api";
import { adaptArticles } from '../Utils/helpers';
import { Link } from "react-router-dom";

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

        <section className="join-us-wrapper about-index">
          <h1>
            The Slow Content Community
          </h1>
          <h3>
            Your place for mindful publishing.
          </h3>
          <p>
            Slowreads.se is an open publishing platform where anyone can join and share their voice. Simply sign up with your email and password to start contributing. Write articles that contribute to the collective stream of content.
          </p>
          <p>
            You can explore a wide range of topics and engage with the community.
          </p>
        </section>

        <section>
          <Link onClick={handleLinkClick} className="link-removelink" to={"/content/main/latest"}>
            <div className="signup-index btn-flow-idx">
              Start Exploring
              <i className="bi bi-arrow-right-circle-fill fs-3"></i>
            </div>
          </Link>
        </section>
      </main>
    </>
  );
}
