import React,{useEffect,useState} from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";


const News =(props)=>{

    const[articles,setArticles]=useState([]);
    const[loading,setLoading]=useState(true);
    const[page,setPage]=useState(1);
    const[totalResults,setTotalResults]=useState(0);
    
  const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
   document.title = `${capitalizeFirstLetter(props.category)}-NewsMonkey`;
   const updateNews= async()=> {
        props.setProgress(10);
        const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;
        
        setLoading(true);
        let data = await fetch(url);
        props.setProgress(30);
        let parsedData = await data.json();
        props.setProgress(70);
        setArticles(parsedData.articles);
        setTotalResults(parsedData.totalResults);
        setLoading(false);

        props.setProgress(100);
    }

    useEffect(()=>{
        updateNews();
    },[]);   
   const fetchMoreData = async () => {
      
        setPage(page+1)
        const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;
       
        let data = await fetch(url);
        let parsedData = await data.json();
        setArticles(articles.concat(parsedData.articles));
        setTotalResults(parsedData.totalResults);
        setLoading(false);
    

    };
   
        return (
            <>

                <h1 className="text-center m" style={{ margin: '74px 0px 0px 0px' }}> NewsMonkey- Top 
                {capitalizeFirstLetter(props.category)}  Headlines  </h1>
                <div className="text-center"> {loading && <Spinner />}</div>

                <InfiniteScroll
                  dataLength={articles.length}
                    next={fetchMoreData}
                    hasMore={articles.length !==totalResults}
                    loader={<Spinner />}
                >
                    <div className="conatiner newsbox">

                        <div className="row">
                            {articles.map((element, index) => {
                                return <div className="col-md-4" key={index}>
                                    <NewsItem title={element.title} description={element.description} 
                                    imageUrl={element.urlToImage} newsUrl={element.url} author={element.author}
                                     date={element.publishedAt} source={element.source.name} />
                                </div>
                            })}
                        </div>
                    </div>
                </InfiniteScroll>


            </>



        )
    }

export default News
News.defaultProps = {
    country: 'in',
    pageSize: 5,
    category: 'science'
}
News.propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
}
