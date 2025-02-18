import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {LocalStorage} from "../utils/enums/localStorage";
import {RssResponse} from "../models/rss.model";
import {
  BehaviorSubject,
  combineLatestWith,
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
import {v4 as uuid} from 'uuid';
import {ConfigService} from "./config.service";

@Injectable({
  providedIn: 'root'
})
export class FeedService {
  /** Observable of the content returned from the api */
  private content$: Subject<RssResponse[]> = new BehaviorSubject<RssResponse[]>([]);
  /** Observable of the rss feeds to request articles from */
  private feeds$: BehaviorSubject<Source[]> = new BehaviorSubject<Source[]>([]);
  /** Synchronous record of the rss feeds */
  private feeds: Source[] = [];
  /** Observable of the filtered feeds */
  public filteredFeeds$: BehaviorSubject<Source[]> = new BehaviorSubject<Source[]>([]);
  /** The articles returned from the feeds, with filters applied if any are active */
  public articles$: Observable<Article[]> = this.content$.pipe(
    map(
      rssResponses => rssResponses.reduce((articles, rssResponse) => ([...articles, ...this.mapDataToArticles(rssResponse)]), [] as Article[])
    ),
    map(articles => articles.sort((a, b) => Date.parse(a.publishedAt) - Date.parse(b.publishedAt))),
    combineLatestWith(this.filteredFeeds$),
    map(([articles, filteredFeeds]) => {
      if (filteredFeeds.length === 0) {
        return articles;
      } else {
        return articles.filter(article => !!filteredFeeds.find(filter => filter.url === article.sourceUrl))
      }
    })
  );
  /** Observable of the sources the articles are from */
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
    private readonly http: HttpClient,
    private readonly configService: ConfigService
  ) {
  }

  /**
   * Checks whether the feed is already stored, and if not, adds it to the feeds
   *
   * @param newFeed the new feed to add
   */
  public addFeed(newFeed: Source): void {
    const alreadyInFeeds = !!this.feeds.find(feed => feed.url === newFeed.url);
    if (!alreadyInFeeds) {
      this.updateFeeds([...this.feeds, newFeed]);
    }
  }

  /**
   * Deletes the given feed from the feeds
   *
   * @param feedToDelete the feed to delete
   */
  public deleteFeed(feedToDelete: Source): void {
    this.updateFeeds(this.feeds.filter(feed => feed.url !== feedToDelete.url));
  }

  /**
   * Updates local storage and the feeds observable with the current state of the feeds
   *
   * @param updatedFeeds the current state of the feeds
   * @private
   */
  private updateFeeds(updatedFeeds: Source[]): void {
    localStorage.setItem(LocalStorage.FeedUrls, JSON.stringify(updatedFeeds));
    this.feeds$.next(updatedFeeds);
  }

  /**
   * Updates the filtered feeds with sources that match against the given filter. If the given filter is falsy,
   * removes all filters
   *
   * @param filter the filter to match sources against
   */
  public updateFilters(filter: string | null): void {
    if (filter) {
      this.filteredFeeds$.next(this.feeds.filter(feed => feed.name.match(new RegExp(filter, 'i'))));
    } else {
      this.filteredFeeds$.next([]);
    }
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
        // const apiUrl = 'https://api.rss2json.com/v1/api.json';
        const responses = feeds.map(feed =>
          this.configService.apiBaseUrl.pipe(
            switchMap(apiBaseUrl => {
              return this.http.get<RssResponse>(`${apiBaseUrl}?rss_url=${feed.url}`)
            })
          )
        );

        if (responses.length > 0) {
          return forkJoin(responses);
        } else {
          return of([]);
        }
      }),
      map(responses => {
        return responses.map(response => {
          // Uses the feed name the user typed, with the official title as a backup
          const title = this.feeds.find(feed => feed.url === response.feed.url)?.name ?? response.feed.title;
          return {
            ...response,
            feed: {
              ...response.feed,
              title: title[0].toUpperCase() + title.substring(1)
            }
          }
        })
      }),
      tap(content => this.content$.next(content))
    )
  }

  /**
   * Maps the data returned from the RSS api to the format used in the app. The item content is sanitised and shortened.
   *
   * @param data - the data to map into articles
   * @private
   */
  private mapDataToArticles(data: RssResponse): Article[] {
    return data.items.map(item => {
      return {
        id: uuid(),
        title: item.title,
        content: this.normaliseContent(item.content, 30),
        url: item.link,
        publishedAt: item.pubDate,
        source: data.feed.title,
        image: item.thumbnail,
        sourceUrl: data.feed.url
      }
    });
  }

  /**
   * Strips any html tags from the given text and shortens it to the given number of words
   *
   * @param text - the text to normalise
   * @param numberOfWords - the number of words to shorten the text to
   * @private
   */
  private normaliseContent(text: string, numberOfWords: number): string {
    const processedContent = text.replace(/<\/?[^>]+(>|$)/gm, '');
    const words = processedContent.split(' ');
    return words.slice(0, numberOfWords).join(' ') + '...';
  }
}
