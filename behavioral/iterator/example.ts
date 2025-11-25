/**
 * ITERATOR PATTERN - Example
 *
 * Demonstrates the Music Playlist iterator in action.
 */

import {
  createSamplePlaylist,
  MusicPlayer,
  formatDuration,
  formatSong,
  GenreFilterIterator,
} from "./index";

function main() {
  console.log("=".repeat(60));
  console.log("ITERATOR PATTERN - Music Playlist System");
  console.log("=".repeat(60));
  console.log();

  // Create sample playlist
  const playlist = createSamplePlaylist();

  console.log(`1. Created playlist: "${playlist.getName()}"`);
  console.log(`   Songs: ${playlist.getCount()}`);
  console.log(`   Total duration: ${formatDuration(playlist.getTotalDuration())}`);
  console.log();

  // Sequential iteration
  console.log("2. SEQUENTIAL ITERATOR (default order)");
  console.log("-".repeat(40));
  const player = new MusicPlayer();
  player.loadPlaylist(playlist);
  player.playAll();
  console.log();

  // Shuffle iteration
  console.log("3. SHUFFLE ITERATOR (random order)");
  console.log("-".repeat(40));
  player.setIterator(playlist.createShuffleIterator());
  player.playAll();
  console.log();

  // Reverse iteration
  console.log("4. REVERSE ITERATOR");
  console.log("-".repeat(40));
  player.setIterator(playlist.createReverseIterator());
  player.playAll();
  console.log();

  // Filter by genre
  console.log("5. GENRE FILTER ITERATOR (Rock only)");
  console.log("-".repeat(40));
  const rockIterator = playlist.createGenreIterator("Rock");
  player.setIterator(rockIterator);
  player.playAll();

  if (rockIterator instanceof GenreFilterIterator) {
    console.log(`   (Filtered: ${rockIterator.getFilteredCount()} of ${playlist.getCount()} songs)`);
  }
  console.log();

  // Filter by genre - Pop
  console.log("6. GENRE FILTER ITERATOR (Pop only)");
  console.log("-".repeat(40));
  const popIterator = playlist.createGenreIterator("Pop");
  player.setIterator(popIterator);
  player.playAll();
  console.log();

  // Filter by artist
  console.log("7. ARTIST FILTER ITERATOR (songs with 'Michael')");
  console.log("-".repeat(40));
  player.setIterator(playlist.createArtistIterator("Michael"));
  player.playAll();
  console.log();

  // Manual iteration with play/next
  console.log("8. MANUAL ITERATION (play one at a time)");
  console.log("-".repeat(40));
  player.loadPlaylist(playlist);
  player.play();
  player.play();
  player.play();
  console.log("   (Stopped after 3 songs)");
  console.log();

  // Reset and continue
  console.log("9. RESET AND CONTINUE");
  console.log("-".repeat(40));
  player.reset();
  player.play();
  console.log("   (Back to first song after reset)");
  console.log();

  // Demonstrate iterator independence
  console.log("10. ITERATOR INDEPENDENCE");
  console.log("-".repeat(40));
  console.log("   Creating two iterators on the same playlist:");
  console.log();

  const iter1 = playlist.createIterator();
  const iter2 = playlist.createIterator();

  console.log("   Iterator 1 - first 2 songs:");
  console.log(`     1. ${formatSong(iter1.next()!)}`);
  console.log(`     2. ${formatSong(iter1.next()!)}`);
  console.log();

  console.log("   Iterator 2 - first 2 songs (independent position):");
  console.log(`     1. ${formatSong(iter2.next()!)}`);
  console.log(`     2. ${formatSong(iter2.next()!)}`);
  console.log();

  console.log("   Both iterators traverse independently!");
  console.log();

  // Show all available genres
  console.log("11. GENRE AVAILABILITY");
  console.log("-".repeat(40));
  const genres = ["Rock", "Pop", "Jazz", "Soul", "Classical"];
  genres.forEach((genre) => {
    const iter = playlist.createGenreIterator(genre);
    let count = 0;
    while (iter.hasNext()) {
      iter.next();
      count++;
    }
    console.log(`   ${genre}: ${count} song(s)`);
  });
  console.log();

  console.log("=".repeat(60));
  console.log("KEY TAKEAWAYS:");
  console.log("- Iterator provides uniform traversal interface for collections");
  console.log("- Collection's internal structure is hidden from clients");
  console.log("- Multiple iterator types offer different traversal strategies");
  console.log("- Multiple iterators can traverse the same collection independently");
  console.log("- Filter iterators provide subset traversal without modifying collection");
  console.log("- Adding new iterators doesn't require changing the collection");
  console.log("=".repeat(60));
}

main();

