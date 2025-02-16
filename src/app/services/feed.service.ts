import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {LocalStorage} from "../utils/enums/localStorage";
import {RssResponse} from "../models/rss.model";
import {BehaviorSubject, forkJoin, map, Observable, of, shareReplay, Subject, switchMap, tap} from "rxjs";
import {Article} from "../models/article.model";

@Injectable({
  providedIn: 'root'
})
export class FeedService {
  /** The rss feeds to request articles from */
  private feeds$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  /** The articles returned from the feeds */
  public articles$: Observable<Article[]> = this.fetchContent().pipe(
    map(
      rssResponses => rssResponses.reduce((articles, rssResponse) => ([ ...articles, ...this.mapDataToArticles(rssResponse)]), [] as Article[])
    ),
    shareReplay(1)
  );

  constructor(
    private readonly http: HttpClient
  ) {}

  /**
   * Combines the feeds in the service with any feeds stored in local storage, removing duplicates
   *
   * @private
   */
  private getFeeds(): Observable<string[]> {
    return this.feeds$.pipe(
      map(feeds => {
        const data = localStorage.getItem(LocalStorage.FeedUrls);
        const storedFeeds: string[] = data ? JSON.parse(data) : [
          'https://feeds.bbci.co.uk/news/technology/rss.xml',
          'https://www.adweek.com/feed/'
        ];

        return [
          ...feeds,
          ...storedFeeds.filter(storedFeed => !feeds.includes(storedFeed))
        ];
      }),
    );
  }

  /**
   * Fetches the content from every stored feed and combines the responses
   *
   * @private
   */
  private fetchContent(): Observable<RssResponse[]> {
    return this.getFeeds().pipe(
      switchMap(feeds => {
        const apiUrl = 'https://api.rss2json.com/v1/api.json';
        const responses = feeds.map(feed => this.http.get<RssResponse>(`${apiUrl}?rss_url=${feed}`));
        return forkJoin(responses);
      }),
    )
  }

  /**
   * Maps the data returned from the RSS api to the format used in the app
   *
   * @param data - the data to map into articles
   * @private
   */
  private mapDataToArticles(data: RssResponse): Article[] {
    return data.items.map(item => ({
      title: item.title,
      content: item.content,
      url: item.link,
      publishedAt: item.pubDate,
      source: data.feed.title,
      image: item.thumbnail
    }));
  }
}
