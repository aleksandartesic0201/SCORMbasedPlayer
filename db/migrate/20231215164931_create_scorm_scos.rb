class CreateScormScos < ActiveRecord::Migration[7.0]
  def change
    create_table :scorm_scos do |t|
      t.bigint :scorm
      t.string :manifest
      t.string :organization
      t.string :parent
      t.string :identifier
      t.string :launch
      t.string :scormtype
      t.string :title

      t.timestamps
    end
  end
end
