import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {LocalStorage} from "../utils/enums/localStorage";
import {RssResponse} from "../models/rss.model";
import {
  BehaviorSubject,
  forkJoin,
  map,
  Observable,
  of,
  Subject,
  switchMap,
  tap
} from "rxjs";
import {Article} from "../models/article.model";
import {Source} from "../models/source.model";

@Injectable({
  providedIn: 'root'
})
export class FeedService {
  private content$: Subject<RssResponse[]> = new Subject<RssResponse[]>();
  /** The rss feeds to request articles from */
  private feeds$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  private feeds: string[] = [];
  /** The articles returned from the feeds */
  public articles$: Observable<Article[]> = this.content$.pipe(
    tap(content => console.log({content})),
    map(
      rssResponses => rssResponses.reduce((articles, rssResponse) => ([...articles, ...this.mapDataToArticles(rssResponse)]), [] as Article[])
    )
  );
  public sources$: Observable<Source[]> = this.articles$.pipe(
    map(
      articles => articles.reduce((sources: Source[], article: Article) => {
        const sourcePresent = !!sources.find(source => source.url === article.sourceUrl);

        if (sourcePresent) {
          return sources;
        } else {
          return [
            ...sources,
            {
              name: article.source,
              url: article.sourceUrl
            }
          ]
        }
      }, [])
    )
  );

  constructor(
    private readonly http: HttpClient
  ) {
  }

  public addFeed(newFeed: string): void {
    if (!this.feeds.includes(newFeed)) {
      this.updateFeeds([...this.feeds, newFeed]);
    }
  }

  public deleteFeed(feedToDelete: string): void {
    this.updateFeeds(this.feeds.filter(feed => feed !== feedToDelete));
  }

  private updateFeeds(updatedFeeds: string[]): void {
    localStorage.setItem(LocalStorage.FeedUrls, JSON.stringify(updatedFeeds));
    this.feeds$.next(updatedFeeds);
  }

  /**
   * Combines the feeds in the service with any feeds stored in local storage, removing duplicates
   *
   * @private
   */
  private getFeeds(): Observable<string[]> {
    return this.feeds$.pipe(
      map(feeds => {
        const data = localStorage.getItem(LocalStorage.FeedUrls);
        const storedFeeds: string[] = data ? JSON.parse(data) : ['https://www.adweek.com/feed/', 'https://feeds.bbci.co.uk/news/technology/rss.xml'];

        return [
          ...feeds,
          ...storedFeeds.filter((storedFeed) => !feeds.includes(storedFeed))
        ];
      }),
      tap(feeds => this.feeds = feeds)
    );
  }

  /**
   * Fetches the content from every stored feed and combines the responses
   *
   * @private
   */
  public fetchContent() {
    return this.getFeeds().pipe(
      switchMap(feeds => {
        const apiUrl = 'https://api.rss2json.com/v1/api.json';
        const responses = feeds.map(feed => this.http.get<RssResponse>(`${apiUrl}?rss_url=${feed}`));

        if (responses.length > 0) {
          return forkJoin(responses);
        } else {
          return of([]);
        }
      }),
      tap(content => this.content$.next(content))
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
      image: item.thumbnail,
      sourceUrl: data.feed.url
    }));
  }
}
