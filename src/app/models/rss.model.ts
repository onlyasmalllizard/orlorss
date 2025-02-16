export interface RssResponse {
  status: 'ok' | 'error';
  feed: RssFeed;
  items: RssArticle[];
}


interface RssFeed {
  url: string;
  title: string;
  link: string;
  author: string;
  description: string;
  image: string;
}

interface RssArticle {
  title: string;
  pubDate: string;
  link: string;
  guid: string;
  author: string;
  thumbnail: string;
  description: string;
  content: string;
  enclosure: {
    thumbnail: string;
  };
  categories: string[];
}
