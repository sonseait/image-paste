import * as React from "react";

function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function readAsDataURL(file) {
  return new Promise((resolver) => {
    var reader = new FileReader();
    reader.onload = function (event) {
      resolver(event.target.result);
    };
    reader.readAsDataURL(file);
  });
}

export class Input extends React.PureComponent {
  textAreaRef = React.createRef();

  state = {
    value: "",
  };

  async componentDidMount() {
    document.addEventListener("paste", this.onPaste);
  }

  componentWillUnmount() {
    document.removeEventListener("paste", this.onPaste);
  }

  onPaste = async (event) => {
    if (this.textAreaRef.current === document.activeElement) {
      var items = (event.clipboardData || event.originalEvent.clipboardData)
        .items;
      let result = [];
      for (let index in items) {
        var item = items[index];
        if (item.kind === "file") {
          var blob = item.getAsFile();
          const dataUrl = readAsDataURL(blob);
          result.push({
            id: uuidv4(),
            type: "IMAGE",
            data: dataUrl,
          });
        }
      }
      if (result.length > 0) {
        result = await Promise.all(
          result.map(async (r) => ({
            ...r,
            data: await r.data,
          }))
        );
        this.props.onSend && this.props.onSend(result);
      }
    }
  };

  onKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      this.props.onSend &&
        this.props.onSend([
          {
            id: uuidv4(),
            type: "TEXT",
            data: this.state.value,
          },
        ]);
      this.setState({
        value: "",
      });
    }
  };

  onChange = (e) => {
    this.setState({
      value: e.target.value,
    });
  };

  render() {
    return (
      <textarea
        value={this.state.value}
        ref={this.textAreaRef}
        rows={10}
        style={{
          width: "100%",
        }}
        onChange={this.onChange}
        onKeyDown={this.onKeyDown}
      />
    );
  }
}
