export const SCHEMA_STATEMENTS: string[] = [
  `DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('superadmin','admin','editor');
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;`,
  `DO $$ BEGIN
    CREATE TYPE status_kegiatan AS ENUM ('akan_datang','berlangsung','selesai','dibatalkan');
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;`,
  `CREATE OR REPLACE FUNCTION set_updated_at()
  RETURNS TRIGGER AS $$
  BEGIN
      NEW.updated_at = CURRENT_TIMESTAMP;
      RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;`,
  `CREATE TABLE IF NOT EXISTS master_kabinet (
      id_kabinet        INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      nama_kabinet      VARCHAR(150) NOT NULL,
      logo_kabinet      VARCHAR(255),
      deskripsi_kabinet TEXT,
      tahun_periode     VARCHAR(20) NOT NULL,
      visi_kabinet      TEXT,
      misi_kabinet      TEXT,
      created_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  );`,
  `DO $$ BEGIN
    CREATE TRIGGER trg_master_kabinet_updated_at
        BEFORE UPDATE ON master_kabinet
        FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;`,
  `CREATE TABLE IF NOT EXISTS users (
      id_user     INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      id_kabinet  INTEGER,
      nama        VARCHAR(150) NOT NULL,
      email       VARCHAR(150) NOT NULL UNIQUE,
      password    VARCHAR(255) NOT NULL,
      role        user_role NOT NULL DEFAULT 'admin',
      created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_users_kabinet FOREIGN KEY (id_kabinet) REFERENCES master_kabinet(id_kabinet)
          ON UPDATE CASCADE ON DELETE SET NULL
  );`,
  `CREATE TABLE IF NOT EXISTS media_sosial (
      id_sosmed         INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      id_kabinet        INTEGER NOT NULL,
      platform          VARCHAR(50) NOT NULL,
      username          VARCHAR(100),
      link_media_sosial VARCHAR(255) NOT NULL,
      icon_media_sosial VARCHAR(255),
      CONSTRAINT fk_sosmed_kabinet FOREIGN KEY (id_kabinet) REFERENCES master_kabinet(id_kabinet)
          ON UPDATE CASCADE ON DELETE CASCADE
  );`,
  `CREATE TABLE IF NOT EXISTS layanan (
      id_layanan        INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      id_kabinet        INTEGER NOT NULL,
      nama_layanan      VARCHAR(150) NOT NULL,
      deskripsi_layanan TEXT,
      icon_layanan      VARCHAR(255),
      link_layanan      VARCHAR(255),
      urutan_tampil     SMALLINT NOT NULL DEFAULT 0,
      CONSTRAINT fk_layanan_kabinet FOREIGN KEY (id_kabinet) REFERENCES master_kabinet(id_kabinet)
          ON UPDATE CASCADE ON DELETE CASCADE
  );`,
  `CREATE TABLE IF NOT EXISTS publikasi_terkini (
      id_publikasi       INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      id_penulis         INTEGER NOT NULL,
      judul_publikasi    VARCHAR(200) NOT NULL,
      isi_publikasi      TEXT NOT NULL,
      gambar_publikasi   VARCHAR(255),
      tanggal_publikasi  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      kategori_publikasi VARCHAR(100),
      CONSTRAINT fk_publikasi_penulis FOREIGN KEY (id_penulis) REFERENCES users(id_user)
          ON UPDATE CASCADE ON DELETE RESTRICT
  );`,
  `CREATE TABLE IF NOT EXISTS agenda (
      id_agenda         INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      id_kabinet        INTEGER NOT NULL,
      judul_agenda      VARCHAR(200) NOT NULL,
      deskripsi_program TEXT,
      timeline_agenda   VARCHAR(150),
      lokasi            VARCHAR(200),
      poster_agenda     VARCHAR(255),
      link_pendaftaran  VARCHAR(255),
      status_agenda     status_kegiatan NOT NULL DEFAULT 'akan_datang',
      CONSTRAINT fk_agenda_kabinet FOREIGN KEY (id_kabinet) REFERENCES master_kabinet(id_kabinet)
          ON UPDATE CASCADE ON DELETE CASCADE
  );`,
  `CREATE TABLE IF NOT EXISTS program_unggulan (
      id_program            INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      id_kabinet            INTEGER NOT NULL,
      nama_program          VARCHAR(200) NOT NULL,
      deskripsi_program     TEXT,
      gambar_program        VARCHAR(255),
      tanggal_waktu_program TIMESTAMP,
      status_program        status_kegiatan NOT NULL DEFAULT 'akan_datang',
      CONSTRAINT fk_program_kabinet FOREIGN KEY (id_kabinet) REFERENCES master_kabinet(id_kabinet)
          ON UPDATE CASCADE ON DELETE CASCADE
  );`,
  `CREATE TABLE IF NOT EXISTS statistik_kabinet (
      id_statistik              INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      id_kabinet                INTEGER NOT NULL,
      jumlah_fungsionaris       INTEGER NOT NULL DEFAULT 0,
      jumlah_bidang_biro_kantor INTEGER NOT NULL DEFAULT 0,
      periode                   VARCHAR(20),
      CONSTRAINT fk_statkabinet_kabinet FOREIGN KEY (id_kabinet) REFERENCES master_kabinet(id_kabinet)
          ON UPDATE CASCADE ON DELETE CASCADE
  );`,
  `CREATE TABLE IF NOT EXISTS statistik_dewan_pimpinan (
      id_statistik            INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      id_kabinet              INTEGER NOT NULL,
      nama_ketua_bem          VARCHAR(150) NOT NULL,
      nama_wakil_ketua_bem    VARCHAR(150),
      nama_sekretaris_kabinet VARCHAR(150),
      CONSTRAINT fk_statdewan_kabinet FOREIGN KEY (id_kabinet) REFERENCES master_kabinet(id_kabinet)
          ON UPDATE CASCADE ON DELETE CASCADE
  );`,
  `CREATE TABLE IF NOT EXISTS statistik_koordinator (
      id_statistik     INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      id_kabinet       INTEGER NOT NULL,
      nama_koordinator VARCHAR(150) NOT NULL,
      keterangan       VARCHAR(255),
      CONSTRAINT fk_statkoor_kabinet FOREIGN KEY (id_kabinet) REFERENCES master_kabinet(id_kabinet)
          ON UPDATE CASCADE ON DELETE CASCADE
  );`,
  `CREATE TABLE IF NOT EXISTS statistik_koordinator_wilayah (
      id_statistik             INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      id_kabinet               INTEGER NOT NULL,
      nama_koordinator_wilayah VARCHAR(150) NOT NULL,
      CONSTRAINT fk_statkoorwil_kabinet FOREIGN KEY (id_kabinet) REFERENCES master_kabinet(id_kabinet)
          ON UPDATE CASCADE ON DELETE CASCADE
  );`,
  `CREATE TABLE IF NOT EXISTS statistik_koorbid_prp (
      id_statistik            INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      id_kabinet              INTEGER NOT NULL,
      nama_koordinator_bidang VARCHAR(150) NOT NULL,
      bidang_yang_dinaungi    VARCHAR(255),
      CONSTRAINT fk_statprp_kabinet FOREIGN KEY (id_kabinet) REFERENCES master_kabinet(id_kabinet)
          ON UPDATE CASCADE ON DELETE CASCADE
  );`,
  `CREATE TABLE IF NOT EXISTS statistik_koorbid_epm (
      id_statistik            INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      id_kabinet              INTEGER NOT NULL,
      nama_koordinator_bidang VARCHAR(150) NOT NULL,
      bidang_yang_dinaungi    VARCHAR(255),
      CONSTRAINT fk_statepm_kabinet FOREIGN KEY (id_kabinet) REFERENCES master_kabinet(id_kabinet)
          ON UPDATE CASCADE ON DELETE CASCADE
  );`,
  `CREATE TABLE IF NOT EXISTS statistik_koorbid_mbk (
      id_statistik            INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      id_kabinet              INTEGER NOT NULL,
      nama_koordinator_bidang VARCHAR(150) NOT NULL,
      bidang_yang_dinaungi    VARCHAR(255),
      CONSTRAINT fk_statmbk_kabinet FOREIGN KEY (id_kabinet) REFERENCES master_kabinet(id_kabinet)
          ON UPDATE CASCADE ON DELETE CASCADE
  );`,
  `CREATE TABLE IF NOT EXISTS statistik_koorbid_kemal (
      id_statistik            INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      id_kabinet              INTEGER NOT NULL,
      nama_koordinator_bidang VARCHAR(150) NOT NULL,
      bidang_yang_dinaungi    VARCHAR(255),
      CONSTRAINT fk_statkemal_kabinet FOREIGN KEY (id_kabinet) REFERENCES master_kabinet(id_kabinet)
          ON UPDATE CASCADE ON DELETE CASCADE
  );`,
  `CREATE TABLE IF NOT EXISTS statistik_koorbid_dinkam (
      id_statistik            INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      id_kabinet              INTEGER NOT NULL,
      nama_koordinator_bidang VARCHAR(150) NOT NULL,
      bidang_yang_dinaungi    VARCHAR(255),
      CONSTRAINT fk_statdinkam_kabinet FOREIGN KEY (id_kabinet) REFERENCES master_kabinet(id_kabinet)
          ON UPDATE CASCADE ON DELETE CASCADE
  );`,
  `CREATE TABLE IF NOT EXISTS statistik_inspektorat_penjamin_mutu (
      id_statistik        INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      id_kabinet          INTEGER NOT NULL,
      jumlah_fungsionaris INTEGER NOT NULL DEFAULT 0,
      nama_ketua_unit     VARCHAR(150),
      nama_divisi         VARCHAR(150),
      CONSTRAINT fk_statinspektorat_kabinet FOREIGN KEY (id_kabinet) REFERENCES master_kabinet(id_kabinet)
          ON UPDATE CASCADE ON DELETE CASCADE
  );`,
  `CREATE TABLE IF NOT EXISTS statistik_biro_kesekretariatan (
      id_statistik        INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      id_kabinet          INTEGER NOT NULL,
      nama_ketua_biro     VARCHAR(150) NOT NULL,
      jumlah_fungsionaris INTEGER NOT NULL DEFAULT 0,
      CONSTRAINT fk_statbirosekre_kabinet FOREIGN KEY (id_kabinet) REFERENCES master_kabinet(id_kabinet)
          ON UPDATE CASCADE ON DELETE CASCADE
  );`,
  `CREATE TABLE IF NOT EXISTS statistik_kmi (
      id_statistik        INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      id_kabinet          INTEGER NOT NULL,
      nama_ketua_kantor   VARCHAR(150) NOT NULL,
      jumlah_fungsionaris INTEGER NOT NULL DEFAULT 0,
      jumlah_divisi       INTEGER NOT NULL DEFAULT 0,
      nama_divisi         VARCHAR(150),
      CONSTRAINT fk_statkmi_kabinet FOREIGN KEY (id_kabinet) REFERENCES master_kabinet(id_kabinet)
          ON UPDATE CASCADE ON DELETE CASCADE
  );`,
  `CREATE TABLE IF NOT EXISTS statistik_biro_statistik (
      id_statistik        INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      id_kabinet          INTEGER NOT NULL,
      jumlah_fungsionaris INTEGER NOT NULL DEFAULT 0,
      nama_ketua_biro     VARCHAR(150) NOT NULL,
      jumlah_divisi       INTEGER NOT NULL DEFAULT 0,
      nama_divisi         VARCHAR(150),
      CONSTRAINT fk_statbirostat_kabinet FOREIGN KEY (id_kabinet) REFERENCES master_kabinet(id_kabinet)
          ON UPDATE CASCADE ON DELETE CASCADE
  );`,
  `CREATE TABLE IF NOT EXISTS statistik_biro_keuangan (
      id_statistik        INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      id_kabinet          INTEGER NOT NULL,
      nama_ketua_biro     VARCHAR(150) NOT NULL,
      jumlah_fungsionaris INTEGER NOT NULL DEFAULT 0,
      CONSTRAINT fk_statbirokeu_kabinet FOREIGN KEY (id_kabinet) REFERENCES master_kabinet(id_kabinet)
          ON UPDATE CASCADE ON DELETE CASCADE
  );`,
  `CREATE TABLE IF NOT EXISTS statistik_bidang_riset_keilmuan (
      id_statistik            INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      id_kabinet              INTEGER NOT NULL,
      nama_koordinator_bidang VARCHAR(150) NOT NULL,
      jumlah_fungsionaris     INTEGER NOT NULL DEFAULT 0,
      nama_ketua_bidang       VARCHAR(150),
      jumlah_divisi           INTEGER NOT NULL DEFAULT 0,
      nama_divisi             VARCHAR(150),
      CONSTRAINT fk_statriset_kabinet FOREIGN KEY (id_kabinet) REFERENCES master_kabinet(id_kabinet)
          ON UPDATE CASCADE ON DELETE CASCADE
  );`,
  `CREATE TABLE IF NOT EXISTS statistik_bidang_sosial_politik (
      id_statistik            INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      id_kabinet              INTEGER NOT NULL,
      nama_koordinator_bidang VARCHAR(150) NOT NULL,
      nama_ketua_bidang       VARCHAR(150),
      jumlah_fungsionaris     INTEGER NOT NULL DEFAULT 0,
      jumlah_divisi           INTEGER NOT NULL DEFAULT 0,
      nama_divisi             VARCHAR(150),
      CONSTRAINT fk_statsospol_kabinet FOREIGN KEY (id_kabinet) REFERENCES master_kabinet(id_kabinet)
          ON UPDATE CASCADE ON DELETE CASCADE
  );`,
  `CREATE TABLE IF NOT EXISTS statistik_bidang_pemberdayaan_perempuan (
      id_statistik            INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      id_kabinet              INTEGER NOT NULL,
      nama_koordinator_bidang VARCHAR(150) NOT NULL,
      nama_ketua_bidang       VARCHAR(150),
      jumlah_fungsionaris     INTEGER NOT NULL DEFAULT 0,
      jumlah_divisi           INTEGER NOT NULL DEFAULT 0,
      nama_divisi             VARCHAR(150),
      CONSTRAINT fk_statperempuan_kabinet FOREIGN KEY (id_kabinet) REFERENCES master_kabinet(id_kabinet)
          ON UPDATE CASCADE ON DELETE CASCADE
  );`,
  `CREATE TABLE IF NOT EXISTS statistik_bidang_kemitraan_eksternal (
      id_statistik            INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      id_kabinet              INTEGER NOT NULL,
      nama_koordinator_bidang VARCHAR(150) NOT NULL,
      nama_ketua_bidang       VARCHAR(150),
      jumlah_fungsionaris     INTEGER NOT NULL DEFAULT 0,
      jumlah_divisi           INTEGER NOT NULL DEFAULT 0,
      nama_divisi             VARCHAR(150),
      CONSTRAINT fk_statkemitraan_kabinet FOREIGN KEY (id_kabinet) REFERENCES master_kabinet(id_kabinet)
          ON UPDATE CASCADE ON DELETE CASCADE
  );`,
  `CREATE TABLE IF NOT EXISTS statistik_bidang_sosial_masyarakat (
      id_statistik            INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      id_kabinet              INTEGER NOT NULL,
      nama_koordinator_bidang VARCHAR(150) NOT NULL,
      nama_ketua_bidang       VARCHAR(150),
      jumlah_fungsionaris     INTEGER NOT NULL DEFAULT 0,
      jumlah_divisi           INTEGER NOT NULL DEFAULT 0,
      nama_divisi             VARCHAR(150),
      CONSTRAINT fk_statsosmasy_kabinet FOREIGN KEY (id_kabinet) REFERENCES master_kabinet(id_kabinet)
          ON UPDATE CASCADE ON DELETE CASCADE
  );`,
  `CREATE TABLE IF NOT EXISTS statistik_bidang_harmonisasi_kampus (
      id_statistik            INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      id_kabinet              INTEGER NOT NULL,
      nama_koordinator_bidang VARCHAR(150) NOT NULL,
      nama_ketua_bidang       VARCHAR(150),
      jumlah_fungsionaris     INTEGER NOT NULL DEFAULT 0,
      jumlah_divisi           INTEGER NOT NULL DEFAULT 0,
      nama_divisi             VARCHAR(150),
      CONSTRAINT fk_statharmonisasi_kabinet FOREIGN KEY (id_kabinet) REFERENCES master_kabinet(id_kabinet)
          ON UPDATE CASCADE ON DELETE CASCADE
  );`,
  `CREATE TABLE IF NOT EXISTS statistik_bidang_kpsdm (
      id_statistik            INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      id_kabinet              INTEGER NOT NULL,
      nama_koordinator_bidang VARCHAR(150) NOT NULL,
      nama_ketua_bidang       VARCHAR(150),
      jumlah_fungsionaris     INTEGER NOT NULL DEFAULT 0,
      jumlah_divisi           INTEGER NOT NULL DEFAULT 0,
      nama_divisi             VARCHAR(150),
      CONSTRAINT fk_statkpsdm_kabinet FOREIGN KEY (id_kabinet) REFERENCES master_kabinet(id_kabinet)
          ON UPDATE CASCADE ON DELETE CASCADE
  );`,
  `CREATE TABLE IF NOT EXISTS statistik_bidang_lingkungan_hidup (
      id_statistik            INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      id_kabinet              INTEGER NOT NULL,
      nama_koordinator_bidang VARCHAR(150) NOT NULL,
      nama_ketua_bidang       VARCHAR(150),
      jumlah_fungsionaris     INTEGER NOT NULL DEFAULT 0,
      jumlah_divisi           INTEGER NOT NULL DEFAULT 0,
      nama_divisi             VARCHAR(150),
      CONSTRAINT fk_statlingkungan_kabinet FOREIGN KEY (id_kabinet) REFERENCES master_kabinet(id_kabinet)
          ON UPDATE CASCADE ON DELETE CASCADE
  );`,
  `CREATE TABLE IF NOT EXISTS statistik_bidang_ekonomi_kreatif (
      id_statistik            INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      id_kabinet              INTEGER NOT NULL,
      nama_koordinator_bidang VARCHAR(150) NOT NULL,
      nama_ketua_bidang       VARCHAR(150),
      jumlah_fungsionaris     INTEGER NOT NULL DEFAULT 0,
      jumlah_divisi           INTEGER NOT NULL DEFAULT 0,
      nama_divisi             VARCHAR(150),
      CONSTRAINT fk_statekokreatif_kabinet FOREIGN KEY (id_kabinet) REFERENCES master_kabinet(id_kabinet)
          ON UPDATE CASCADE ON DELETE CASCADE
  );`,
  `CREATE TABLE IF NOT EXISTS statistik_bidang_seni_olahraga (
      id_statistik            INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      id_kabinet              INTEGER NOT NULL,
      nama_koordinator_bidang VARCHAR(150) NOT NULL,
      nama_ketua_bidang       VARCHAR(150),
      jumlah_fungsionaris     INTEGER NOT NULL DEFAULT 0,
      jumlah_divisi           INTEGER NOT NULL DEFAULT 0,
      nama_divisi             VARCHAR(150),
      CONSTRAINT fk_statseniolahraga_kabinet FOREIGN KEY (id_kabinet) REFERENCES master_kabinet(id_kabinet)
          ON UPDATE CASCADE ON DELETE CASCADE
  );`,
  `CREATE TABLE IF NOT EXISTS statistik_bidang_kesejahteraan_mahasiswa (
      id_statistik            INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      id_kabinet              INTEGER NOT NULL,
      nama_koordinator_bidang VARCHAR(150) NOT NULL,
      nama_ketua_bidang       VARCHAR(150),
      jumlah_fungsionaris     INTEGER NOT NULL DEFAULT 0,
      jumlah_divisi           INTEGER NOT NULL DEFAULT 0,
      nama_divisi             VARCHAR(150),
      CONSTRAINT fk_statkesejahteraan_kabinet FOREIGN KEY (id_kabinet) REFERENCES master_kabinet(id_kabinet)
          ON UPDATE CASCADE ON DELETE CASCADE
  );`,
  `CREATE INDEX IF NOT EXISTS idx_users_kabinet ON users(id_kabinet);`,
  `CREATE INDEX IF NOT EXISTS idx_sosmed_kabinet ON media_sosial(id_kabinet);`,
  `CREATE INDEX IF NOT EXISTS idx_layanan_kabinet ON layanan(id_kabinet);`,
  `CREATE INDEX IF NOT EXISTS idx_publikasi_penulis ON publikasi_terkini(id_penulis);`,
  `CREATE INDEX IF NOT EXISTS idx_publikasi_tanggal ON publikasi_terkini(tanggal_publikasi);`,
  `CREATE INDEX IF NOT EXISTS idx_agenda_kabinet ON agenda(id_kabinet);`,
  `CREATE INDEX IF NOT EXISTS idx_program_kabinet ON program_unggulan(id_kabinet);`
];
