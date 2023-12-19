# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2023_12_15_165136) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "scorm_sco_tracks", force: :cascade do |t|
    t.bigint "scorm"
    t.bigint "sco"
    t.bigint "user"
    t.text "elementname"
    t.text "elementvalue"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "scorm_scos", force: :cascade do |t|
    t.bigint "scorm"
    t.string "manifest"
    t.string "organization"
    t.string "parent"
    t.string "identifier"
    t.string "launch"
    t.string "scormtype"
    t.string "title"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "scorms", force: :cascade do |t|
    t.string "title"
    t.string "reference"
    t.string "version"
    t.string "targetid"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "users", force: :cascade do |t|
    t.string "first_name"
    t.string "last_name"
    t.string "email"
    t.string "password"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "password_digest"
  end

end
