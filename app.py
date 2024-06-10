from flask import Flask, render_template, request, redirect, url_for, jsonify
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from werkzeug.utils import secure_filename
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///meal_management_system.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
UPLOAD_FOLDER = 'member_photo'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
db = SQLAlchemy(app)

# I am going to write all the model Here
class Member(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=True)
    phone = db.Column(db.String(20), nullable=True)
    nid = db.Column(db.String(20), nullable=True)
    email = db.Column(db.String(100), nullable=True)
    photo = db.Column(db.String(100), nullable=True)



class Item(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    bajar_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    bajarkari = db.Column(db.String(100), nullable=False)
    meal_cost = db.Column(db.Float, nullable=False)
    extra = db.Column(db.Float, nullable=True)
    total_cost = db.Column(db.Float, nullable=False)



class Notice(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)



class Cleaning(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    cleaning_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    cleaner1 = db.Column(db.String(100), nullable=False)
    cleaner2 = db.Column(db.String(100), nullable=False)








# I am going to write all the route is here.

@app.route("/")
@app.route("/home/")
def home():
    return render_template("home.html")

@app.route("/members/")
def members():
    all_members = Member.query.all()
    return render_template("members.html", members=all_members)

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route("/add_member/", methods=["GET", "POST"])
def add_member():
    if request.method == "POST":
        name = request.form["name"]
        phone = request.form["phone"]
        nid = request.form["nid"]
        email = request.form["email"]
        if 'photo' in request.files:
            file = request.files['photo']
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
                photo_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            else:
                photo_path = None
        else:
            photo_path = None
        new_member = Member(name=name, phone=phone, nid=nid, email=email, photo=photo_path)
        db.session.add(new_member)
        db.session.commit()
        return redirect(url_for("members"))
    return render_template("add_member.html")

@app.route("/bajar/")
def bajar():
    bajar_list = Item.query.all()
    return render_template("bajar.html", bajar_list=bajar_list)

@app.route("/add_items/", methods=["GET", "POST"])
def add_items():
    if request.method == "POST":
        bajar_date_str = request.form["bajar_date"]
        bajarkari = request.form["bajarkari"]
        meal_cost = float(request.form["meal_cost"])
        extra = float(request.form["extra"]) if request.form["extra"] else None
        total_cost = float(request.form["totalCost"])
        bajar_date = datetime.strptime(bajar_date_str, "%Y-%m-%d")
        new_item = Item(bajar_date=bajar_date, bajarkari=bajarkari, meal_cost=meal_cost, extra=extra, total_cost=total_cost)
        db.session.add(new_item)
        db.session.commit()
        return redirect(url_for("bajar"))
    return render_template("add_items.html")


@app.route("/notice/")
def notice():
    notices = Notice.query.all()
    return render_template("notice.html", notices=notices)

@app.route("/new_notice/", methods=["GET", "POST"])
def new_notice():
    if request.method == "POST":
        title = request.form["title"]
        description = request.form["description"]
        new_notice = Notice(title=title, description=description)
        db.session.add(new_notice)
        db.session.commit()
        return redirect(url_for("notice"))
    return render_template("new_notice.html")

@app.route("/cleaning/")
def cleaning():
    cleanings = Cleaning.query.all()
    return render_template("cleaning.html", cleanings=cleanings)

@app.route("/add_cleaner/", methods=["GET", "POST"])
def add_cleaner():
    if request.method == "POST":
        try:
            cleaning_date_str = request.form["cleaning_date"]
            cleaner1 = request.form["cleaner1"]
            cleaner2 = request.form["cleaner2"]
            cleaning_date = datetime.strptime(cleaning_date_str, "%Y-%m-%d")
            cleaning = Cleaning(cleaning_date=cleaning_date, cleaner1=cleaner1, cleaner2=cleaner2)
            db.session.add(cleaning)
            db.session.commit()
            return redirect(url_for("cleaning"))
        except Exception as e:
            return f"An error occurred: {str(e)}"
    return render_template("add_cleaner.html")

@app.route("/meal_rent/")
def meal_rent():
    return render_template("meal_rent.html")

if __name__ == '__main__':
    app.run(debug=True)