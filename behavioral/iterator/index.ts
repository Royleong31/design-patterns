/**
 * ITERATOR PATTERN
 *
 * Intent: Provide a way to access the elements of an aggregate object sequentially
 * without exposing its underlying representation.
 *
 * Real-world example: Music Playlist System
 * - A playlist contains songs stored in various ways (array, linked list, tree)
 * - Users want to iterate through songs without knowing how they're stored
 * - Different iteration orders: sequential, shuffle, by genre, by artist
 * - The iterator abstracts away the collection's internal structure
 */

/**
 * Iterator Interface
 */
export interface Iterator<T> {
  hasNext(): boolean;
  next(): T | null;
  current(): T | null;
  reset(): void;
}

/**
 * Aggregate Interface - Collection that can create iterators
 */
export interface IterableCollection<T> {
  createIterator(): Iterator<T>;
  getItems(): T[];
  getCount(): number;
}

/**
 * Song - The element type we're iterating over
 */
export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  genre: string;
  durationSeconds: number;
  year: number;
}

/**
 * Concrete Aggregate - Playlist
 */
export class Playlist implements IterableCollection<Song> {
  private name: string;
  private songs: Song[] = [];

  constructor(name: string) {
    this.name = name;
  }

  getName(): string {
    return this.name;
  }

  addSong(song: Song): void {
    this.songs.push(song);
  }

  removeSong(id: string): boolean {
    const index = this.songs.findIndex((s) => s.id === id);
    if (index > -1) {
      this.songs.splice(index, 1);
      return true;
    }
    return false;
  }

  getItems(): Song[] {
    return [...this.songs];
  }

  getCount(): number {
    return this.songs.length;
  }

  getTotalDuration(): number {
    return this.songs.reduce((sum, song) => sum + song.durationSeconds, 0);
  }

  // Factory methods for different iterators
  createIterator(): Iterator<Song> {
    return new SequentialIterator(this);
  }

  createShuffleIterator(): Iterator<Song> {
    return new ShuffleIterator(this);
  }

  createReverseIterator(): Iterator<Song> {
    return new ReverseIterator(this);
  }

  createGenreIterator(genre: string): Iterator<Song> {
    return new GenreFilterIterator(this, genre);
  }

  createArtistIterator(artist: string): Iterator<Song> {
    return new ArtistFilterIterator(this, artist);
  }
}

/**
 * Concrete Iterator - Sequential (default order)
 */
export class SequentialIterator implements Iterator<Song> {
  private collection: Playlist;
  private position: number = 0;

  constructor(collection: Playlist) {
    this.collection = collection;
  }

  hasNext(): boolean {
    return this.position < this.collection.getCount();
  }

  next(): Song | null {
    if (!this.hasNext()) {
      return null;
    }
    const song = this.collection.getItems()[this.position];
    this.position++;
    return song;
  }

  current(): Song | null {
    if (this.position === 0 || this.position > this.collection.getCount()) {
      return null;
    }
    return this.collection.getItems()[this.position - 1];
  }

  reset(): void {
    this.position = 0;
  }
}

/**
 * Concrete Iterator - Shuffle (random order)
 */
export class ShuffleIterator implements Iterator<Song> {
  private collection: Playlist;
  private shuffledIndices: number[] = [];
  private position: number = 0;

  constructor(collection: Playlist) {
    this.collection = collection;
    this.shuffle();
  }

  private shuffle(): void {
    const count = this.collection.getCount();
    this.shuffledIndices = Array.from({ length: count }, (_, i) => i);

    // Fisher-Yates shuffle
    for (let i = count - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.shuffledIndices[i], this.shuffledIndices[j]] = [
        this.shuffledIndices[j],
        this.shuffledIndices[i],
      ];
    }
  }

  hasNext(): boolean {
    return this.position < this.shuffledIndices.length;
  }

  next(): Song | null {
    if (!this.hasNext()) {
      return null;
    }
    const index = this.shuffledIndices[this.position];
    this.position++;
    return this.collection.getItems()[index];
  }

  current(): Song | null {
    if (this.position === 0 || this.position > this.shuffledIndices.length) {
      return null;
    }
    const index = this.shuffledIndices[this.position - 1];
    return this.collection.getItems()[index];
  }

  reset(): void {
    this.position = 0;
    this.shuffle(); // Reshuffle on reset
  }
}

/**
 * Concrete Iterator - Reverse order
 */
export class ReverseIterator implements Iterator<Song> {
  private collection: Playlist;
  private position: number;

  constructor(collection: Playlist) {
    this.collection = collection;
    this.position = collection.getCount() - 1;
  }

  hasNext(): boolean {
    return this.position >= 0;
  }

  next(): Song | null {
    if (!this.hasNext()) {
      return null;
    }
    const song = this.collection.getItems()[this.position];
    this.position--;
    return song;
  }

  current(): Song | null {
    if (this.position < -1 || this.position >= this.collection.getCount()) {
      return null;
    }
    return this.collection.getItems()[this.position + 1];
  }

  reset(): void {
    this.position = this.collection.getCount() - 1;
  }
}

/**
 * Concrete Iterator - Filter by Genre
 */
export class GenreFilterIterator implements Iterator<Song> {
  private filteredSongs: Song[] = [];
  private position: number = 0;

  constructor(collection: Playlist, genre: string) {
    this.filteredSongs = collection
      .getItems()
      .filter((song) => song.genre.toLowerCase() === genre.toLowerCase());
  }

  hasNext(): boolean {
    return this.position < this.filteredSongs.length;
  }

  next(): Song | null {
    if (!this.hasNext()) {
      return null;
    }
    const song = this.filteredSongs[this.position];
    this.position++;
    return song;
  }

  current(): Song | null {
    if (this.position === 0 || this.position > this.filteredSongs.length) {
      return null;
    }
    return this.filteredSongs[this.position - 1];
  }

  reset(): void {
    this.position = 0;
  }

  getFilteredCount(): number {
    return this.filteredSongs.length;
  }
}

/**
 * Concrete Iterator - Filter by Artist
 */
export class ArtistFilterIterator implements Iterator<Song> {
  private filteredSongs: Song[] = [];
  private position: number = 0;

  constructor(collection: Playlist, artist: string) {
    this.filteredSongs = collection
      .getItems()
      .filter((song) => song.artist.toLowerCase().includes(artist.toLowerCase()));
  }

  hasNext(): boolean {
    return this.position < this.filteredSongs.length;
  }

  next(): Song | null {
    if (!this.hasNext()) {
      return null;
    }
    const song = this.filteredSongs[this.position];
    this.position++;
    return song;
  }

  current(): Song | null {
    if (this.position === 0 || this.position > this.filteredSongs.length) {
      return null;
    }
    return this.filteredSongs[this.position - 1];
  }

  reset(): void {
    this.position = 0;
  }

  getFilteredCount(): number {
    return this.filteredSongs.length;
  }
}

/**
 * Music Player - Uses iterators to play songs
 */
export class MusicPlayer {
  private currentIterator: Iterator<Song> | null = null;
  private playlist: Playlist | null = null;
  private nowPlaying: Song | null = null;

  loadPlaylist(playlist: Playlist, iterator?: Iterator<Song>): void {
    this.playlist = playlist;
    this.currentIterator = iterator || playlist.createIterator();
    console.log(`  [Player] Loaded playlist: ${playlist.getName()} (${playlist.getCount()} songs)`);
  }

  setIterator(iterator: Iterator<Song>): void {
    this.currentIterator = iterator;
    console.log(`  [Player] Changed playback mode`);
  }

  play(): void {
    if (!this.currentIterator) {
      console.log(`  [Player] No playlist loaded`);
      return;
    }

    if (this.currentIterator.hasNext()) {
      this.nowPlaying = this.currentIterator.next();
      if (this.nowPlaying) {
        console.log(`  [Player] ▶ Now playing: "${this.nowPlaying.title}" by ${this.nowPlaying.artist}`);
      }
    } else {
      console.log(`  [Player] End of playlist`);
    }
  }

  playAll(): void {
    if (!this.currentIterator) {
      console.log(`  [Player] No playlist loaded`);
      return;
    }

    console.log(`  [Player] Playing all songs...`);
    let count = 0;
    while (this.currentIterator.hasNext()) {
      const song = this.currentIterator.next();
      if (song) {
        count++;
        console.log(`    ${count}. "${song.title}" - ${song.artist} (${formatDuration(song.durationSeconds)})`);
      }
    }
    console.log(`  [Player] Played ${count} songs`);
  }

  getNowPlaying(): Song | null {
    return this.nowPlaying;
  }

  reset(): void {
    this.currentIterator?.reset();
    this.nowPlaying = null;
    console.log(`  [Player] Reset to beginning`);
  }
}

/**
 * Helper to create sample songs
 */
export function createSamplePlaylist(): Playlist {
  const playlist = new Playlist("My Favorites");

  const songs: Song[] = [
    { id: "1", title: "Bohemian Rhapsody", artist: "Queen", album: "A Night at the Opera", genre: "Rock", durationSeconds: 354, year: 1975 },
    { id: "2", title: "Billie Jean", artist: "Michael Jackson", album: "Thriller", genre: "Pop", durationSeconds: 294, year: 1982 },
    { id: "3", title: "Smells Like Teen Spirit", artist: "Nirvana", album: "Nevermind", genre: "Rock", durationSeconds: 301, year: 1991 },
    { id: "4", title: "Like a Prayer", artist: "Madonna", album: "Like a Prayer", genre: "Pop", durationSeconds: 340, year: 1989 },
    { id: "5", title: "Hotel California", artist: "Eagles", album: "Hotel California", genre: "Rock", durationSeconds: 390, year: 1977 },
    { id: "6", title: "Take On Me", artist: "A-ha", album: "Hunting High and Low", genre: "Pop", durationSeconds: 225, year: 1985 },
    { id: "7", title: "So What", artist: "Miles Davis", album: "Kind of Blue", genre: "Jazz", durationSeconds: 545, year: 1959 },
    { id: "8", title: "Superstition", artist: "Stevie Wonder", album: "Talking Book", genre: "Soul", durationSeconds: 245, year: 1972 },
  ];

  songs.forEach((song) => playlist.addSong(song));
  return playlist;
}

/**
 * Format duration in mm:ss
 */
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

/**
 * Format song info
 */
export function formatSong(song: Song): string {
  return `"${song.title}" by ${song.artist} [${song.genre}] (${formatDuration(song.durationSeconds)})`;
}

