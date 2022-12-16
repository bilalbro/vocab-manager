<?php

class Database {
   private $isConnected = false;
   private $pgConnection;

   private function connect() {
      if (!$this->isConnected) {
         $this->isConnected = true;

         $this->pgConnection = pg_connect('
            host=localhost
            user=postgres
            password=Global1235p?
            dbname=p2
         ');
      }
   }

   private function query($query, $params = null) {
      // first connect to database
      $this->connect();

      if ($params) {
         $result = pg_query_params($this->pgConnection, $query, $params);
      }
      else {
         $result = pg_query($this->pgConnection, $query);
      }
      
      return pg_fetch_all($result);
   }
 
   public function addRecord($record) {
      $dbRecord = []; 
      $dbRecord[] = $record['word_name'];
      $dbRecord[] = $record['synonyms'];
      $dbRecord[] = $record['meaning'];
      $dbRecord[] = $record['examples'];
      $dbRecord[] = $record['usage'];

      $query = <<<END
         INSERT INTO words
         (word_name, synonyms, meaning, examples, usage, date_added, date_updated)
         VALUES
         ($1, $2, $3, $4, $5, now(), now())
      END;

      $this->query($query, $dbRecord);

      return true;
   }

   public function removeRecord() {}

   private function processRecord($record) {
      /**
       * Here's what happens with each column:
       * 
       * word_name: Remains as it is.
       * meaning: Remains as it is.
       * examples: Split apart at every sequence of 2 newline characters, and the
       *           word within each sentence highlighted using the <b> tag.
       */

      $word_name = strtolower($record['word_name']);
      $examples = preg_split('/\n\s+/', $record['examples']);

      foreach ($examples as &$example) {
         $example = preg_replace("/($word_name)/i", '<b>$1</b>', $example);
      }

      $record['examples'] = $examples;

      return $record;
   }

   public function getRecord($wid) {
      $query = <<<END
         SELECT * FROM words WHERE wid=$wid;
      END;
      
      $res = $this->query($query);

      return $res[0];
   }

   public function getProcessedRecord($wid) {
      $res = $this->getRecord($wid);

      return $this->processRecord($res);
   }
   
   public function getAllRecords() {
      $query = <<<END
         SELECT wid, word_name, meaning FROM words
         ORDER BY word_name;
      END;
      
      $result = $this->query($query);

      return $result;
   }

   public function getMostUsedRecords() {
      $n = 10;

      $query = <<<END
         SELECT wid, word_name, meaning FROM words
         ORDER BY usage DESC, word_name ASC LIMIT $n;
      END;
      
      return $this->query($query);
   }

   public function getLeastUsedRecords() {
      $n = 10;

      $query = <<<END
         SELECT wid, word_name, meaning FROM words
         ORDER BY usage ASC, word_name ASC LIMIT $n;
      END;
      
      return $this->query($query);
   }

   public function searchRecord($word_name_query, $left_wildcard, $right_wildcard, $search_synonyms) {
      // Search for the given $word_name_query in the table by looking up in the
      // word_name column and then even in the synonyms column.

      $ending_clause = ';';

      if ($search_synonyms) {
         $ending_clause = "OR synonyms ILIKE '%$word_name_query%';";
      }
      
      $query = <<<END
         SELECT wid, word_name, meaning FROM words
         WHERE
            word_name ILIKE '{$left_wildcard}$word_name_query{$right_wildcard}'
            $ending_clause
      END;


      return $this->query($query);
   }
   
   public function updateRecord($wid, $record) {
      $dbRecord = []; 
      $dbRecord[] = $record['word_name'];
      $dbRecord[] = $record['synonyms'];
      $dbRecord[] = $record['meaning'];
      $dbRecord[] = $record['examples'];

      $query = <<<END
         UPDATE words
         SET (word_name, synonyms, meaning, examples, date_updated)
         =   ($1,        $2,       $3,      $4,       now())
         WHERE wid=$wid;
      END;

      $this->query($query, $dbRecord);

      return true;
   }

   public function getRandomRecord() {
      $wids = [];
      $res = $this->query("SELECT wid FROM words;");

      foreach ($res as $row) {
         array_push($wids, $row['wid']);
      }

      $index = array_rand($wids, 1);
      return $this->getProcessedRecord($wids[$index]);
   }

   public function deleteRecord($wid) {
      $query = <<<END
         DELETE FROM words
         WHERE wid=$wid;
      END;

      return $this->query($query);
   }

   public function useWord($wid) {
      $query = <<<END
         UPDATE words
         SET usage = usage + 1
         WHERE wid=$wid;
      END;

      return $this->query($query);
   }

}

$db = new Database();

?>