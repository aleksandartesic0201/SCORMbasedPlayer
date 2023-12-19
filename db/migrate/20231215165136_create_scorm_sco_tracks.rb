class CreateScormScoTracks < ActiveRecord::Migration[7.0]
  def change
    create_table :scorm_sco_tracks do |t|
      t.bigint :scorm
      t.bigint :sco
      t.bigint :user
      t.text :elementname
      t.text :elementvalue

      t.timestamps
    end
  end
end
