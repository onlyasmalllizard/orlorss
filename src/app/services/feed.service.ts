import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {LocalStorage} from "../utils/enums/localStorage";
import {RssResponse} from "../models/rss.model";
import {
  BehaviorSubject, combineLatestWith,
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
  private feeds$: BehaviorSubject<Source[]> = new BehaviorSubject<Source[]>([]);
  private feeds: Source[] = [];
  public filteredFeeds$: BehaviorSubject<Source[]> = new BehaviorSubject<Source[]>([]);
  /** The articles returned from the feeds */
  public articles$: Observable<Article[]> = this.content$.pipe(
    map(
      rssResponses => rssResponses.reduce((articles, rssResponse) => ([...articles, ...this.mapDataToArticles(rssResponse)]), [] as Article[])
    ),
    combineLatestWith(this.filteredFeeds$),
    map(([articles, filteredFeeds]) => {
      if (filteredFeeds.length === 0) {
        return articles;
      } else {
        return articles.filter(article => !!filteredFeeds.find(filter => filter.url === article.sourceUrl))
      }
    })
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

  constructor(private readonly http: HttpClient) {}

  public addFeed(newFeed: Source): void {
    const alreadyInFeeds = !!this.feeds.find(feed => feed.url === newFeed.url);
    if (!alreadyInFeeds) {
      this.updateFeeds([...this.feeds, newFeed]);
    }
  }

  public deleteFeed(feedToDelete: Source): void {
    this.updateFeeds(this.feeds.filter(feed => feed.url !== feedToDelete.url));
  }

  public updateFilters(filter: string | null): void {
    if (filter) {
      this.filteredFeeds$.next(this.feeds.filter(feed => feed.name.match(new RegExp(filter, 'i'))));
    } else {
      this.filteredFeeds$.next([]);
    }
  }

  private updateFeeds(updatedFeeds: Source[]): void {
    localStorage.setItem(LocalStorage.FeedUrls, JSON.stringify(updatedFeeds));
    this.feeds$.next(updatedFeeds);
  }

  /**
   * Gets the feeds from local storage. If there aren't any, returns an empty array.
   *
   * @private
   */
  private getFeeds(): Observable<Source[]> {
    return this.feeds$.pipe(
      map(() => {
        const data = localStorage.getItem(LocalStorage.FeedUrls);
        return data ? JSON.parse(data) : [];
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
        const responses = feeds.map(feed => this.http.get<RssResponse>(`${apiUrl}?rss_url=${feed.url}`));

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
