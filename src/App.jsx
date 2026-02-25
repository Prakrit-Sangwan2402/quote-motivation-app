import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [quoteData, setQuoteData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [likedQuotes, setLikedQuotes] = useState(() => {
    const storedQuotes = localStorage.getItem("likedQuotes");
    return storedQuotes ? JSON.parse(storedQuotes) : [];
  });
  const [searchText, setSearchText] = useState("");

  const fetchRandomQuote = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://dummyjson.com/quotes/random"
      );
      const data = await response.json();

      setQuoteData({
        _id: data.id,
        content: data.quote,
        author: data.author,
      });
    } catch (error) {
      console.log("Error fetching quote:", error);
      setQuoteData(null);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchRandomQuote();
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "likedQuotes",
      JSON.stringify(likedQuotes)
    );
  }, [likedQuotes]);

  const toggleLike = () => {
    if (!quoteData) return;

    const alreadyLiked = likedQuotes.some(
      (item) => item._id === quoteData._id
    );

    if (alreadyLiked) {
      const updatedList = likedQuotes.filter(
        (item) => item._id !== quoteData._id
      );
      setLikedQuotes(updatedList);
    } else {
      setLikedQuotes([...likedQuotes, quoteData]);
    }
  };

  const filteredLikedQuotes = likedQuotes.filter((item) =>
    item.content
      .toLowerCase()
      .includes(searchText.toLowerCase())
  );

  const isCurrentLiked =
    quoteData &&
    likedQuotes.some(
      (item) => item._id === quoteData._id
    );

  return (
    <div className="app-container">
      <h1>Daily Motivation</h1>

      <div className="quote-box">
        {isLoading ? (
          <p>Loading new quote...</p>
        ) : quoteData ? (
          <>
            <p className="quote-text">
              "{quoteData.content}"
            </p>
            <p className="quote-author">
              — {quoteData.author}
            </p>
          </>
        ) : (
          <p>No quote available.</p>
        )}
      </div>

      <div className="button-group">
        <button
          onClick={fetchRandomQuote}
          disabled={isLoading}
        >
          New Quote
        </button>

        <button
          onClick={toggleLike}
          disabled={!quoteData}
        >
          {isCurrentLiked
            ? "Unlike ❤️"
            : "Like ❤️"}
        </button>
      </div>

      <h3>
        Total Liked Quotes: {likedQuotes.length}
      </h3>

      <input
        type="text"
        placeholder="Search liked quotes..."
        value={searchText}
        onChange={(e) =>
          setSearchText(e.target.value)
        }
      />

      <div className="liked-list">
        {filteredLikedQuotes.length === 0 ? (
          <p>No liked quotes found.</p>
        ) : (
          filteredLikedQuotes.map((item) => (
            <div
              key={item._id}
              className="liked-item"
            >
              <p>"{item.content}"</p>
              <small>
                — {item.author}
              </small>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;