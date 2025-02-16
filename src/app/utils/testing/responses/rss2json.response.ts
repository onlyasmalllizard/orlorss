import {RssResponse} from "../../../models/rss.model";

export const rss2JsonResponse: RssResponse = {
  status: 'ok',
  feed: {
    url: "https://feeds.bbci.co.uk/news/technology/rss.xml",
    title: "BBC News",
    link: "https://www.bbc.co.uk/news/technology",
    author: "",
    description: "BBC News - Technology",
    image: "https://news.bbcimg.co.uk/nol/shared/img/bbc_news_120x60.gif"
  },
  items: [
    {
      author: "",
      categories: [],
      content: 'They say the US should re-evaluate its cyber-security partnership with the UK unless the "dangerous"' +
        ' request is withdrawn.',
      description: 'They say the US should re-evaluate its cyber-security partnership with the UK unless the' +
        ' "dangerous" request is withdrawn.',
      enclosure: { thumbnail: "https://ichef.bbci.co.uk/ace/standard/240/cpsprodpb/7cea/live/61764b10-eab4-11ef-80bb-c173c17a1e53.jpg" },
      guid: "https://www.bbc.com/news/articles/c5yvn90pl5no#0",
      link: "https://www.bbc.com/news/articles/c5yvn90pl5no",
      pubDate: "2025-02-14 11:23:07",
      thumbnail: "https://ichef.bbci.co.uk/ace/standard/240/cpsprodpb/7cea/live/61764b10-eab4-11ef-80bb-c173c17a1e53.jpg",
      title: "US politicians furious at UK demand for encrypted Apple data"
    }
  ]
};
