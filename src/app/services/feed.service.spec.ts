import {TestBed, waitForAsync} from '@angular/core/testing';
import { FeedService } from './feed.service';
import {HttpClient} from "@angular/common/http";
import {LocalStorage} from "../utils/enums/localStorage";
import {of} from "rxjs";
import {rss2JsonResponse} from "../utils/testing/responses/rss2json.response";
import {Article} from "../models/article.model";

const httpClient = {
  get: jest.fn().mockReturnValue(of(rss2JsonResponse))
};

describe('FeedService', () => {
  let service: FeedService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: httpClient }
      ]
    });
    service = TestBed.inject(FeedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('addFeed', () => {
    beforeEach(() => localStorage.clear());

    it('should add the given feed to the service and to localstorage', waitForAsync(() => {
      const newFeed = 'test';
      const expected = [newFeed];

      service.addFeed(newFeed);

      const localStorageResult = JSON.parse(localStorage.getItem(LocalStorage.FeedUrls) ?? '');
      expect(localStorageResult).toEqual(expected);
      // @ts-expect-error asserting on private property
      service.feeds$.subscribe({
        next: feeds => expect(feeds).toEqual(expected),
        error: e => fail(e)
      });
    }));

    it('should not add the feed if it is already stored', waitForAsync(() => {
      const initialFeeds = ['test'];
      // @ts-expect-error setting private property
      service.feeds$.next(initialFeeds);
      // @ts-expect-error setting private property
      service.feeds = initialFeeds;

      service.addFeed('test');

      // @ts-expect-error asserting on private property
      service.feeds$.subscribe({
        next: feeds => expect(feeds).toEqual(initialFeeds),
        error: e => fail(e)
      });
    }));
  });

  describe('deleteFeed', () => {
    beforeEach(() => localStorage.clear());

    it('should remove the given feed from the service and from local storage', waitForAsync(() => {
      const feeds = ['a', 'b', 'c'];
      localStorage.setItem(LocalStorage.FeedUrls, JSON.stringify(feeds));
      // @ts-expect-error setting private property
      service.feeds$.next(feeds);
      // @ts-expect-error setting private property
      service.feeds = feeds;

      const expected = ['a', 'c'];
      service.deleteFeed('b');

      const localStorageResult = JSON.parse(localStorage.getItem(LocalStorage.FeedUrls) ?? '');
      expect(localStorageResult).toEqual(expected);
      // @ts-expect-error asserting against private property
      service.feeds$.subscribe({
        next: feeds => expect(feeds).toEqual(expected),
        error: e => fail(e)
      });
    }));

    it('should remove all articles associated with the given feed', waitForAsync(() => {
      const feeds = [{
        name: 'test',
        url: rss2JsonResponse.feed.url
      }];
      // @ts-expect-error setting private property
      service.feeds$.next(feeds);
      // @ts-expect-error setting private property
      service.feeds = feeds;
      // @ts-expect-error mocking private method
      service.content$.next([rss2JsonResponse]);

      service.deleteFeed(feeds[0].url);

      service.articles$.subscribe({
        next: articles => expect(articles).toEqual([]),
        error: e => fail(e)
      });
    }));
  });

  describe('getFeeds', () => {
    beforeEach(() => localStorage.clear());

    it('should return the feeds from both the service and local storage without duplicates', waitForAsync(() => {
      const mockFeeds = ['a', 'b', 'c'];
      // @ts-expect-error setting private property
      service.feeds$.next(mockFeeds);
      localStorage.setItem(LocalStorage.FeedUrls, JSON.stringify([...mockFeeds, 'd']));

      const expected = ['a', 'b', 'c', 'd'];
      // @ts-expect-error testing private method
      service.getFeeds().subscribe({
        next: feeds => expect(feeds).toEqual(expected),
        error: e => fail(e)
      });
    }));

    it('should return an empty array if no feeds are stored in the service or in local storage', waitForAsync(() => {
      // @ts-expect-error testing private method
      service.getFeeds().subscribe({
        next: feeds => expect(feeds).toEqual([]),
        error: e => fail(e)
      });
    }));
  });

  describe('fetchContent', () => {
    it('should request the content using the urls in the feeds property', waitForAsync(() => {
      // @ts-expect-error spying on private method
      jest.spyOn(service, 'getFeeds').mockReturnValue(of(['test']));

      // @ts-expect-error testing private method
      service.fetchContent().subscribe({
        next: () => expect(httpClient.get).toHaveBeenCalledWith('https://api.rss2json.com/v1/api.json?rss_url=test'),
        error: e => fail(e)
      });
    }));

    it('should return an observable containing the results of all requests', waitForAsync(() => {
      // @ts-expect-error spying on private method
      jest.spyOn(service, 'getFeeds').mockReturnValue(of(['test', 'test2']));

      // @ts-expect-error testing private method
      service.fetchContent().subscribe({
        next: res => expect(res).toEqual([rss2JsonResponse, rss2JsonResponse]),
        error: e => fail(e)
      });
    }));
  });

  describe('mapDataToArticles', () => {
    it('should convert the data returned from the RSS feed to the article structure', () => {
      const mockArticle = rss2JsonResponse.items[0];
      const expected: Article = {
        title: mockArticle.title,
        content: mockArticle.content,
        publishedAt: mockArticle.pubDate,
        url: mockArticle.link,
        source: rss2JsonResponse.feed.title,
        image: mockArticle.thumbnail,
        sourceUrl: rss2JsonResponse.feed.url
      };

      // @ts-expect-error testing private method
      expect(service.mapDataToArticles(rss2JsonResponse)).toEqual([expected]);
    });
  });
});
