import datetime
import numpy as np
import matplotlib.pyplot as plt
import io, base64
import pandas as pd
import os
import js

def func():
    fig, ax = plt.subplots()
    ax.plot([1,3,2])
    buf = io.BytesIO()
    fig.savefig(buf, format='png')
    buf.seek(0)
    img_str = 'data:image/png;base64,' + base64.b64encode(buf.read()).decode('UTF-8')
    return img_str

def make_plot(df, ymax):
    fig = plt.figure(figsize=(10, 7), dpi=200)
    today = datetime.date.today().isoformat()
    plt.title(
        f"NYT crossword solve time (8-week rolling average) as of {today}"
    )
    ax = fig.gca()

    CB_color_cycle = ['#377eb8', '#ff7f00', '#4daf4a',
                  '#f781bf', '#a65628', '#984ea3',
                  '#999999', '#e41a1c', '#dede00']
    color_index = 0

    DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    for day in DAYS:
        rolling_avg = df[df["weekday"] == day]["solve_time_secs"].rolling("56D").mean()
        (rolling_avg / 60.0).plot(
            ax=ax, label=day, linewidth=2, markersize=4, marker="o", linestyle="-", color=CB_color_cycle[color_index]
        )
        color_index = color_index + 1

    plt.legend()
    ax.set_xlabel("Solve Date")
    ax.set_ylabel("Minutes")
    minor_yticks = np.arange(0, ymax + 1, 5)
    ax.set_ylim(0, ymax)
    ax.set_yticks(minor_yticks, minor=True)
    plt.xticks(rotation=0)
    ax.figure.autofmt_xdate()
    plt.grid(True, which="both", axis="both")


    buf = io.BytesIO()
    fig.savefig(buf, format='png')
    buf.seek(0)
    img_str = 'data:image/png;base64,' + base64.b64encode(buf.read()).decode('UTF-8')
    return img_str

def parse_data(csv_path):
    """Parse crossword database stored at the given path into a pandas DataFrame. The DataFrame
    only contains solve data for unaided, solved puzzles and is sorted by the index, the time when
    each puzzle was solved.

    Interesting columns in the returned DataFrame:
    solve_time_secs
    weekday
    """
    df = pd.read_csv(csv_path, parse_dates=["date"], index_col="date")
    df["Solved datetime"] = pd.to_datetime(df["solved_unix"], unit="s")
    # Use the date solved rather than the puzzle date as the index.
    # Puzzle date is interesting for analyzing puzzle difficulty over time (but skewed by change
    # in ability over time)
    # Date solved is interesting for analyzing change in solving ability over time (assuming puzzle
    # difficulty is a constant)
    df.index = df["Solved datetime"]
    df = df.sort_index()
    # Filter out:
    # * Puzzles that were solved more than 7 days after first open. These puzzles were revisited
    # much later, making it hard to make accurate conclusions about the solve time.
    # * Unsolved puzzles
    # * Puzzles where cheats were used
    df = df[
        (df["solved_unix"] - df["opened_unix"] < 3600 * 24 * 7)
        & (df["cheated"] == False)
        & df.solve_time_secs.notnull()
    ]

    return df


def generate():
    csvfile = io.StringIO(js.csvContent)
    df = parse_data(csvfile)
    ymax = df["solve_times_secs"].max() / 60

    return make_plot(df, ymax)


#generate()
func()
