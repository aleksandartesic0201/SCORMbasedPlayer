class CreateScormReport < ActiveRecord::Migration[7.0]
  def change
    create_table :scorm_reports do |t|
      t.bigint :scorm
      t.bigint :user
      t.string :completed_status
      t.string :total_score
      t.string :total_time

      t.timestamps
    end
  end
end
